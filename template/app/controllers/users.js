const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/users')
const { secret } = require('../config')

class UsersCtl {
  // Find all users
  async find(ctx) {
    ctx.body = await User.find()
  }
  // Find the specified user
  async findById(ctx) {
    const user = await User.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, 'The user does not exist')
    }
    ctx.body = user
  }
  // create users
  async create(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const { name } = ctx.request.body
    const repeatedUser = await User.findOne({ name })
    if (repeatedUser) {
      ctx.throw(409, 'The user does not exist')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
  }
  // update users
  async update(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: false },
      password: { type: 'string', required: false }
    })
    const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404, 'The user does not exist')
    }
    ctx.body = user
  }
  // delete users
  async delete(ctx) {
    const user = await User.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, 'The user does not exist')
    }
    ctx.status = 204
  }
  // users login
  async login(ctx) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    const user = await User.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, 'The user name or password is incorrect')
    }
    const { _id, name } = user
    // expiresIn is deadline, 1d is 1 day
    const token = jsonwebtoken.sign({ _id, name }, secret, { expiresIn: '1d' })
    ctx.body = { token }
  }
  // authorize
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(403, 'no authorization')
    }
    await next()
  }
}

module.exports = new UsersCtl()
