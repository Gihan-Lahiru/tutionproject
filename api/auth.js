// api/auth.js
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
    const AuthControllerMod = await import('../backend/controllers/authController.js')
    const authMod = await import('../backend/middleware/auth.js')

    const AuthController = AuthControllerMod.default || AuthControllerMod
    const authMiddleware = authMod.default || authMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/auth'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // /api/auth/send-verification (POST)
    if (parts[0] === 'send-verification' && req.method === 'POST') {
      return AuthController.sendEmailVerification(req, res)
    }

    // /api/auth/verify-code (POST)
    if (parts[0] === 'verify-code' && req.method === 'POST') {
      return AuthController.verifyEmailCode(req, res)
    }

    // /api/auth/register (POST)
    if (parts[0] === 'register' && req.method === 'POST') {
      return AuthController.register(req, res)
    }

    // /api/auth/login (POST)
    if (parts[0] === 'login' && req.method === 'POST') {
      return AuthController.login(req, res)
    }

    // /api/auth/forgot-password (POST)
    if (parts[0] === 'forgot-password' && req.method === 'POST') {
      return AuthController.forgotPassword(req, res)
    }

    // /api/auth/reset-password (POST)
    if (parts[0] === 'reset-password' && req.method === 'POST') {
      return AuthController.resetPassword(req, res)
    }

    // Protected routes below require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/auth/me (GET)
    if (parts[0] === 'me' && req.method === 'GET') {
      return AuthController.getCurrentUser(req, res)
    }

    // /api/auth/change-password (POST)
    if (parts[0] === 'change-password' && req.method === 'POST') {
      return AuthController.changePassword(req, res)
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /auth error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
