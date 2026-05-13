// api/videos.js
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
    const VideoControllerMod = await import('../backend/controllers/videoController.js')
    const authMod = await import('../backend/middleware/auth.js')

    const VideoController = VideoControllerMod.default || VideoControllerMod
    const authMiddleware = authMod.default || authMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/videos'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/videos (GET, POST)
    if (parts.length === 0) {
      if (req.method === 'GET') return VideoController.getAll(req, res)
      if (req.method === 'POST') return VideoController.create(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/videos/class/:classId
    if (parts[0] === 'class') {
      const classId = parts[1]
      req.params = req.params || {}
      req.params.classId = classId

      if (req.method === 'GET') return VideoController.getByClass(req, res)
      if (req.method === 'POST') return VideoController.createByClass(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/videos/:id or /api/videos/:id/...
    const id = parts[0]
    req.params = req.params || {}
    req.params.id = id

    // /api/videos/:id (GET, PUT, DELETE)
    if (parts.length === 1) {
      if (req.method === 'GET') return VideoController.getById(req, res)
      if (req.method === 'PUT') return VideoController.update(req, res)
      if (req.method === 'DELETE') return VideoController.delete(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /videos error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
