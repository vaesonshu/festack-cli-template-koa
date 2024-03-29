const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema({
  // selete: false, can hidden the fields
  __v: { type: Number, select: false },
  name: { type: String, require: true },
  password: { type: String, require: true, select: false }
})

module.exports = model('User', userSchema)
