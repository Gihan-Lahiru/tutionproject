// api/admin.js
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
    const AdminControllerMod = await import('../backend/controllers/adminController.js')

    const authMiddleware = authMod.default || authMod
    const {
      getAllUsers,
      getUserById,
      updateUserStatus,
      updateUserRole,
      getAllPayments,
      getPendingReceipts,
      updatePaymentApproval,
      resetPayment,
      getAllClasses,
      updateClassFee,
      getDashboardStats,
      exportData,
    } = AdminControllerMod.default || AdminControllerMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/admin'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // Admin-only middleware
    const adminOnly = (req, res, next) => {
      if (req.user?.role !== 'admin' && req.user?.role !== 'teacher') {
        return res.status(403).json({ error: 'Admin access required' })
      }
      next()
    }

    await runMiddleware(req, res, adminOnly)

    // /api/admin/users
    if (parts[0] === 'users' && parts.length === 1) {
      if (req.method === 'GET') return getAllUsers(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/admin/users/:id
    if (parts[0] === 'users' && parts.length >= 2) {
      const userId = parts[1]
      req.params = req.params || {}
      req.params.id = userId

      // /api/admin/users/:id/status (PATCH)
      if (parts[2] === 'status' && req.method === 'PATCH') {
        return updateUserStatus(req, res)
      }

      // /api/admin/users/:id/role (PATCH)
      if (parts[2] === 'role' && req.method === 'PATCH') {
        return updateUserRole(req, res)
      }

      // /api/admin/users/:id (GET)
      if (parts.length === 2 && req.method === 'GET') {
        return getUserById(req, res)
      }

      return res.status(404).json({ message: 'Not found' })
    }

    // /api/admin/payments
    if (parts[0] === 'payments' && parts.length === 1) {
      if (req.method === 'GET') return getAllPayments(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/admin/payments/receipts/pending
    if (parts[0] === 'payments' && parts[1] === 'receipts' && parts[2] === 'pending') {
      if (req.method === 'GET') return getPendingReceipts(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/admin/payments/:id/approval (PATCH)
    if (parts[0] === 'payments' && parts[2] === 'approval') {
      const paymentId = parts[1]
      req.params = req.params || {}
      req.params.id = paymentId
      if (req.method === 'PATCH') return updatePaymentApproval(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/admin/payments/:id/reset (POST)
    if (parts[0] === 'payments' && parts[2] === 'reset') {
      const paymentId = parts[1]
      req.params = req.params || {}
      req.params.id = paymentId
      if (req.method === 'POST') return resetPayment(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/admin/classes
    if (parts[0] === 'classes' && parts.length === 1) {
      if (req.method === 'GET') return getAllClasses(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/admin/classes/:id/fee (PATCH)
    if (parts[0] === 'classes' && parts[2] === 'fee') {
      const classId = parts[1]
      req.params = req.params || {}
      req.params.id = classId
      if (req.method === 'PATCH') return updateClassFee(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/admin/stats (GET)
    if (parts[0] === 'stats' && req.method === 'GET') {
      return getDashboardStats(req, res)
    }

    // /api/admin/export (GET)
    if (parts[0] === 'export' && req.method === 'GET') {
      return exportData(req, res)
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /admin error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
