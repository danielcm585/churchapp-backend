const mongoose = require('mongoose')

const Group = require('./groupModel')
const User = require('./userModel')
const Post = require('./postModel')

const Schema = mongoose.Schema

const reportSchema = new Schema({
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  },
  title: String,
  body: String,
  createdAt: {
    type: Date,
    default: Date.now()
  },
  editedAt: {
    type: Date,
    default: Date.now()
  }
})