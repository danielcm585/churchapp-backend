const mongoose = require('mongoose')

const User = require('./userModel')
const Post = require('./postModel')

const Schema = mongoose.Schema

const directSchema = new Schema({
  pinned: {
    type: Boolean,
    default: false
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
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