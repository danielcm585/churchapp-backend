const mongoose = require('mongoose')

const Group = require('./groupModel')

const Schema = mongoose.Schema

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: "https://i.ibb.co/B2cSS4q/download.png"
  },
  groups: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  invites: [{
    type: Schema.Types.ObjectId,
    ref: 'Group'
  }],
  notifications: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  editedAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('User', userSchema)