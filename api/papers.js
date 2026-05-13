// api/papers.js
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
    const roleMod = await import('../backend/middleware/role.js')

    const authMiddleware = authMod.default || authMod
    const roleMiddlewareFactory = roleMod.default || roleMod

    // Dynamically require Paper model and controller utilities
    const PaperMod = await import('../backend/models/Paper.js')
    const Paper = PaperMod.default || PaperMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/papers'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/papers/:id or /api/papers/:id/...
    const id = parts[0]
    req.params = req.params || {}
    req.params.id = id

    // /api/papers/:id/download (GET)
    if (parts[1] === 'download') {
      if (req.method === 'GET') {
        await runMiddleware(req, res, roleMiddlewareFactory('student'))
        
        // Inline the download logic from papers.js route
        try {
          let paper = await Paper.findById(req.params.id)
          if (!paper) return res.status(404).json({ message: 'Paper not found' })

          const UserMod = await import('../backend/models/User.js')
          const User = UserMod.default || UserMod
          const student = await User.findById(req.user.id)
          const studentInfo = { name: student?.name, grade: student?.grade }

          const watermarkMod = await import('../backend/utils/pdfWatermark.js')
          const { addWatermarkToPdf } = watermarkMod

          const watermarkedPdf = await addWatermarkToPdf(paper.file_url, studentInfo)
          res.setHeader('Content-Type', 'application/pdf')
          res.setHeader('Content-Disposition', `attachment; filename="${paper.title}.pdf"`)
          res.send(watermarkedPdf)
        } catch (error) {
          console.error('Download watermarked paper error:', error)
          const msg = String(error?.message || '').toLowerCase()
          if (msg.includes('encrypted')) {
            return res.status(400).json({ message: 'This PDF is encrypted and cannot be watermarked.' })
          }
          if (msg.includes('pdf') || msg.includes('invalid') || msg.includes('failed to download')) {
            return res.status(400).json({ message: 'This file cannot be watermarked (not a valid PDF).' })
          }
          res.status(500).json({ message: 'Failed to download paper.' })
        }
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/papers/upload (POST)
    if (parts[0] === 'upload') {
      if (req.method === 'POST') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher'))
        
        // Inline upload logic from papers.js route (simplified for serverless)
        try {
          res.status(501).json({ message: 'Paper upload endpoint requires multipart form-data handling - configure multer for Vercel' })
        } catch (error) {
          console.error('Upload paper error:', error)
          res.status(500).json({ message: 'Failed to upload paper' })
        }
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /papers error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
