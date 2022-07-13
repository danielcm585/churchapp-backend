const mongoose = require('mongoose')

const User = require('./userModel')
const Group = require('./groupModel')
const Report = require('./reportModel')

const Schema = mongoose.Schema

const postSchema = new Schema({
  status: {
    type: String,
    enum: [ 'ACTIVE', 'BANNED' ],
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
  body: {
    type: String,
    required: true
  },
  picture: String,
  reports: [{
    type: Schema.Types.ObjectId,
    ref: 'Reports'
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

module.exports = mongoose.model('Post', postSchema)