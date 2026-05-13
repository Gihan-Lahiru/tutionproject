// api/assignments.js
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
    const AssignmentControllerMod = await import('../backend/controllers/assignmentController.js')
    const authMod = await import('../backend/middleware/auth.js')
    const roleMod = await import('../backend/middleware/role.js')

    const AssignmentController = AssignmentControllerMod.default || AssignmentControllerMod
    const authMiddleware = authMod.default || authMod
    const roleMiddlewareFactory = roleMod.default || roleMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/assignments'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/assignments/my-assignments
    if (parts[0] === 'my-assignments') {
      if (req.method === 'GET') {
        await runMiddleware(req, res, roleMiddlewareFactory('student'))
        return AssignmentController.getMyAssignments(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/assignments/class/:classId
    if (parts[0] === 'class') {
      const classId = parts[1]
      req.params = req.params || {}
      req.params.classId = classId

      if (req.method === 'GET') return AssignmentController.getByClass(req, res)
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return AssignmentController.create(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/assignments/:id or /api/assignments/:id/...
    const id = parts[0]
    req.params = req.params || {}
    req.params.id = id

    // /api/assignments/:id (GET, PUT, DELETE)
    if (parts.length === 1) {
      if (req.method === 'GET') return AssignmentController.getById(req, res)
      if (req.method === 'PUT') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return AssignmentController.update(req, res)
      }
      if (req.method === 'DELETE') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return AssignmentController.delete(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/assignments/:id/download (GET)
    if (parts[1] === 'download') {
      if (req.method === 'GET') {
        await runMiddleware(req, res, roleMiddlewareFactory('student'))
        return AssignmentController.downloadWithWatermark(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/assignments/:id/submissions (GET)
    if (parts[1] === 'submissions') {
      if (req.method === 'GET') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return AssignmentController.getSubmissions(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/assignments/:id/submit (POST)
    if (parts[1] === 'submit') {
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('student'))
        return AssignmentController.submit(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/assignments/:id/grade (POST)
    if (parts[1] === 'grade') {
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return AssignmentController.grade(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /assignments error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
