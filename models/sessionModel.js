const mongoose = require('mongoose')

const Schema = mongoose.Schema

const sessionSchema = new Schema({
  token: {
    type: String,
    unique: true,
    required: true
  },
  // startedAt: {
  //   type: Date,
  //   default: Date.now(),
  // },
  // expiredAt: {
  //   type: Date,
  //   required: true
  // }
})

module.exports = mongoose.model('Session', sessionSchema)