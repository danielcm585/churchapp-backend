const mongoose = require('mongoose')

const User = require('./userModel')
const Post = require('./postModel')

const Schema = mongoose.Schema

const directSchema = new Schema({
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  chats: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  editedAt: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Direct', directSchema)