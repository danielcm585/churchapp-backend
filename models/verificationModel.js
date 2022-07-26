const mongoose = require('mongoose')

const User = require('./userModel')

const Schema = mongoose.Schema

const verificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Verification', verificationSchema)