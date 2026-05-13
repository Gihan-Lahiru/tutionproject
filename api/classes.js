// api/classes.js
export default async function handler(req, res) {
  const runMiddleware = (req, res, fn) =>
    new Promise((resolve, reject) => {
      if (!fn) return resolve()
      try {
        fn(req, res, (err) => {
          if (err) reject(err)
          else resolve()
        })
      } catch (e) {
        reject(e)
      }
    })

  const parseJsonBody = async (req) => {
    if (req.body) return req.body
    if (req.method === 'GET' || req.method === 'HEAD') return {}
    let raw = ''
    for await (const chunk of req) raw += chunk
    if (!raw) return {}
    try {
      return JSON.parse(raw)
    } catch (e) {
      return {}
    }
  }

  try {
    const ClassControllerMod = await import('../backend/controllers/classController.js')
    const authMod = await import('../backend/middleware/auth.js')
    const roleMod = await import('../backend/middleware/role.js')

    const ClassController = ClassControllerMod.default || ClassControllerMod
    const authMiddleware = authMod.default || authMod
    const roleMiddlewareFactory = roleMod.default || roleMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/classes'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/classes (GET, POST)
    if (parts.length === 0) {
      if (req.method === 'GET') return ClassController.getAll(req, res)
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return ClassController.create(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/classes/my-classes
    if (parts[0] === 'my-classes') {
      if (req.method === 'GET') return ClassController.getMyClasses(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/classes/:id or /api/classes/:id/...
    const id = parts[0]
    req.params = req.params || {}
    req.params.id = id

    // /api/classes/:id (GET, PUT, DELETE)
    if (parts.length === 1) {
      if (req.method === 'GET') return ClassController.getById(req, res)
      if (req.method === 'PUT') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return ClassController.update(req, res)
      }
      if (req.method === 'DELETE') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return ClassController.delete(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/classes/:id/enroll (POST)
    if (parts[1] === 'enroll') {
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('student'))
        return ClassController.enroll(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/classes/:id/students (GET)
    if (parts[1] === 'students') {
      if (req.method === 'GET') return ClassController.getStudents(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/classes/:id/announcements (GET, POST)
    if (parts[1] === 'announcements') {
      if (req.method === 'GET') return ClassController.getAnnouncements(req, res)
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return ClassController.createAnnouncement(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /classes error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
