const mongoose = require('mongoose')

const User = require('./userModel')
const Post = require('./postModel')

const Schema = mongoose.Schema

const directSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  chats: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  pinned: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
})