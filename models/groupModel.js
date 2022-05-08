const mongoose = require('mongoose')

const User = require('./userModel')
const Post = require('./postModel')
const Event = require('./eventModel')

const Schema = mongoose.Schema

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: [ 'PRIVATE', 'PUBLIC' ],
    default: 'PUBLIC'
  },
  leaders: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  pendings: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  invites: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  top: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
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

module.exports = mongoose.model('Group', groupSchema)