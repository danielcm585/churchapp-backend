const mongoose = require('mongoose')

const User = require('./userModel')
const Group = require('./groupModel')

const Schema = mongoose.Schema

const postSchema = new Schema({
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