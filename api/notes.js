// api/notes.js
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
    const NoteControllerMod = await import('../backend/controllers/noteController.js')
    const authMod = await import('../backend/middleware/auth.js')
    const roleMod = await import('../backend/middleware/role.js')

    const NoteController = NoteControllerMod.default || NoteControllerMod
    const authMiddleware = authMod.default || authMod
    const roleMiddlewareFactory = roleMod.default || roleMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/notes'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/notes/class/:classId
    if (parts[0] === 'class') {
      const classId = parts[1]
      req.params = req.params || {}
      req.params.classId = classId

      if (req.method === 'GET') return NoteController.getByClass(req, res)
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return NoteController.create(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/notes/:id or /api/notes/:id/...
    const id = parts[0]
    req.params = req.params || {}
    req.params.id = id

    // /api/notes/:id/download (GET)
    if (parts[1] === 'download') {
      if (req.method === 'GET') {
        await runMiddleware(req, res, roleMiddlewareFactory('student'))
        return NoteController.downloadWithWatermark(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/notes/:id (DELETE)
    if (parts.length === 1) {
      if (req.method === 'DELETE') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return NoteController.delete(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /notes error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
