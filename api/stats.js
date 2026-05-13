// api/stats.js
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
    const authMod = await import('../backend/middleware/auth.js')
    const dbMod = await import('../backend/config/database.js')

    const authMiddleware = authMod.default || authMod
    const db = dbMod.default || dbMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/stats'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/stats/teacher-stats (GET)
    if (parts[0] === 'teacher-stats' && req.method === 'GET') {
      try {
        // Dynamically import and call the actual controller logic
        const StatsMod = await import('../backend/controllers/statsController.js')
        const StatsController = StatsMod.default || StatsMod
        
        if (StatsController.getTeacherStats) {
          return StatsController.getTeacherStats(req, res)
        } else {
          return res.status(501).json({ message: 'Stats controller not fully implemented' })
        }
      } catch (error) {
        console.error('Error fetching teacher stats:', error)
        return res.status(500).json({ error: 'Failed to fetch statistics' })
      }
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /stats error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
