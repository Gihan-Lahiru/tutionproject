// api/users.js
module.exports = async function handler(req, res) {
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
    const UserControllerMod = await import('../backend/controllers/userController.js')
    const authMod = await import('../backend/middleware/auth.js')
    const roleMod = await import('../backend/middleware/role.js')
    const cloudinaryMod = await import('../backend/middleware/cloudinaryUpload.js')

    const UserController = UserControllerMod.default || UserControllerMod
    const authMiddleware = authMod.default || authMod
    const roleMiddlewareFactory = roleMod.default || roleMod
    const uploadProfilePicture =
      cloudinaryMod.uploadProfilePicture || (cloudinaryMod.default && cloudinaryMod.default.uploadProfilePicture)

    // parse URL and path segments relative to /api/users
    const url = new URL(req.url || '/', 'http://localhost')
    const base = '/api/users'
    const pathname = url.pathname.startsWith(base) ? url.pathname.slice(base.length) : url.pathname
    const parts = pathname.split('/').filter(Boolean) // e.g. ['profile'] or ['students','123']

    // populate req.query and req.body
    req.query = Object.fromEntries(url.searchParams.entries())
    req.body = await parseJsonBody(req)

    // All user routes require auth
    await runMiddleware(req, res, authMiddleware)

    // /api/users
    if (parts.length === 0) {
      if (req.method === 'GET') {
        await runMiddleware(req, res, roleMiddlewareFactory('admin'))
        return UserController.getAllUsers(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/users/profile
    if (parts[0] === 'profile') {
      if (req.method === 'GET') return UserController.getProfile(req, res)
      if (req.method === 'PUT') return UserController.updateProfile(req, res)
      if (req.method === 'POST') {
        // multer upload middleware
        const uploadSingle = uploadProfilePicture && uploadProfilePicture.single && uploadProfilePicture.single('profilePicture')
        if (uploadSingle) await runMiddleware(req, res, uploadSingle)
        return UserController.uploadProfilePicture(req, res)
      }
      return res.status(405).json({ message: 'Method not allowed' })
    }

    // /api/users/students and /api/users/students/:id
    if (parts[0] === 'students') {
      // /api/users/students
      if (parts.length === 1) {
        if (req.method === 'GET') {
          await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
          return UserController.getStudents(req, res)
        }
        if (req.method === 'POST') {
          await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
          return UserController.createStudent(req, res)
        }
        return res.status(405).json({ message: 'Method not allowed' })
      }

      // /api/users/students/:id
      const id = parts[1]
      req.params = req.params || {}
      req.params.id = id

      if (req.method === 'GET') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return UserController.getStudentById(req, res)
      }
      if (req.method === 'PUT') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return UserController.updateStudent(req, res)
      }
      if (req.method === 'DELETE') {
        await runMiddleware(req, res, roleMiddlewareFactory('teacher', 'admin'))
        return UserController.deleteStudent(req, res)
      }

      return res.status(405).json({ message: 'Method not allowed' })
    }

    return res.status(404).json({ message: 'Not found' })
  } catch (error) {
    console.error('API /users error:', error)
    if (!res.headersSent) res.status(500).json({ error: error?.message || 'Internal server error' })
  }
}
