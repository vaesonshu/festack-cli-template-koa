const Router = require('koa-router')
// koa-jwt middleware can realize user authentication and authorization
const jwt = require('koa-jwt')
const { secret } = require('../config')

const router = new Router({ prefix: '/users' })
const { find, findById, create, update, delete: del, login, checkOwner } = require('../controllers/users')

const auth = jwt({ secret })

router.get('/', find)
router.post('/', create)
router.get('/:id', findById)
router.patch('/:id', auth, checkOwner, update)
router.delete('/:id', auth, checkOwner, del)
router.post('/login', login)

module.exports = router
