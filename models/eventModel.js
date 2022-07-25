const mongoose = require('mongoose')

const User = require('./userModel')
const Group = require('./groupModel')

const Schema = mongoose.Schema

const eventSchema = new Schema({
  activation: {
    type: String,
    enum: [ 'PENDING', 'ACTIVE', 'SUSPENDED', 'BANNED' ],
    default: 'ACTIVE'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  date: {
    type: Date,
    required: true
  },
  title: String,
  picture: String,
  detail: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  editedAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Event', eventSchema)