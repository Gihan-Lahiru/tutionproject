// api/payments.js
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
    const PaymentControllerMod = await import('../backend/controllers/paymentController.js')
    const authMod = await import('../backend/middleware/auth.js')
    const uploadMod = await import('../backend/middleware/upload.js')

    const PaymentController = PaymentControllerMod.default || PaymentControllerMod
    const authMiddleware = authMod.default || authMod
    const upload = uploadMod.default || uploadMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/payments'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // /api/payments/verify (POST - no auth, webhook)
    if (parts[0] === 'verify' && req.method === 'POST') {
      return PaymentController.verifyPayment(req, res)
    }

    // All other routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/payments/my-payments (GET)
    if (parts[0] === 'my-payments' && req.method === 'GET') {
      return PaymentController.getMyPayments(req, res)
    }

    // /api/payments/request-reactivation (POST)
    if (parts[0] === 'request-reactivation' && req.method === 'POST') {
      return PaymentController.requestReactivation(req, res)
    }

    // /api/payments/user/:userId (GET)
    if (parts[0] === 'user') {
      const userId = parts[1]
      req.params = req.params || {}
      req.params.userId = userId
      if (req.method === 'GET') return PaymentController.getUserPayments(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/payments/init (POST)
    if (parts[0] === 'init' && req.method === 'POST') {
      return PaymentController.initPayment(req, res)
    }

    // /api/payments/stats (GET)
    if (parts[0] === 'stats' && req.method === 'GET') {
      return PaymentController.getStats(req, res)
    }

    // /api/payments/all (GET)
    if (parts[0] === 'all' && req.method === 'GET') {
      return PaymentController.getAllPayments(req, res)
    }

    // /api/payments/remind (POST)
    if (parts[0] === 'remind' && req.method === 'POST') {
      return PaymentController.sendReminder(req, res)
    }

    // /api/payments/:id or /api/payments/:id/...
    const id = parts[0]
    req.params = req.params || {}
    req.params.id = id

    // /api/payments/:id/receipt (POST)
    if (parts[1] === 'receipt' && parts.length === 2) {
      if (req.method === 'POST') {
        const uploadSingle = upload && upload.single && upload.single('receipt')
        if (uploadSingle) await runMiddleware(req, res, uploadSingle)
        return PaymentController.uploadReceipt(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/payments/receipts/pending (GET)
    if (parts[0] === 'receipts' && parts[1] === 'pending' && req.method === 'GET') {
      return PaymentController.getPendingReceipts(req, res)
    }

    // /api/payments/:id/receipt/approve (POST)
    if (parts[1] === 'receipt' && parts[2] === 'approve') {
      if (req.method === 'POST') return PaymentController.approveReceipt(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/payments/:id/receipt/reject (POST)
    if (parts[1] === 'receipt' && parts[2] === 'reject') {
      if (req.method === 'POST') return PaymentController.rejectReceipt(req, res)
      return res.status(405).json({ message: 'Method not allowed' })
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /payments error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
