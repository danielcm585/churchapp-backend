const mongoose = require('mongoose')

const Group = require('./groupModel')
const Report = require('./reportModel')
const Direct = require('./directModel')

const Schema = mongoose.Schema

const userSchema = new Schema({
  role: {
    type: String,
    enum: [ 'ADMIN', 'USER' ],
    default: 'USER'
  },
  activation: {
    type: String,
    enum: [ 'PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED' ],
    default: 'ACTIVE'
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: String,
  name: String,
  phone: String,
  address: String,
  birth: Date,
  gender: {
    type: String,
    enum: [ 'Male', 'Female' ]
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
  directs: [{
    type: Schema.Types.ObjectId,
    ref: 'Direct'
  }],
  notifications: [{
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }],
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Report'
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