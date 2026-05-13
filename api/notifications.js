// api/notifications.js
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
    const NotificationMod = await import('../backend/models/Notification.js')

    const authMiddleware = authMod.default || authMod
    const Notification = NotificationMod.default || NotificationMod

    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/notifications'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean)

    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/notifications/my-notifications (GET)
    if (parts[0] === 'my-notifications' && req.method === 'GET') {
      try {
        const userId = req.user.id
        const notifications = await Notification.getByUser(userId, 20)
        const unreadCount = await Notification.getUnreadCount(userId)

        return res.json({
          notifications: notifications.map((n) => ({
            id: n.id,
            type: n.type,
            message: n.message,
            created_at: n.created_at,
            unread: Number(n.read) === 0,
          })),
          unreadCount,
        })
      } catch (error) {
        console.error('Error fetching notifications:', error)
        return res.status(500).json({ error: 'Failed to fetch notifications' })
      }
    }

    // /api/notifications/mark-read (PATCH)
    if (parts[0] === 'mark-read' && req.method === 'PATCH') {
      try {
        const userId = req.user.id
        await Notification.markAllAsRead(userId)
        return res.json({ success: true })
      } catch (error) {
        console.error('Error marking notifications as read:', error)
        return res.status(500).json({ error: 'Failed to mark notifications as read' })
      }
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /notifications error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
