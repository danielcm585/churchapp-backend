const mongoose = require('mongoose')

const User = require('./userModel')
const Post = require('./postModel')
const Event = require('./eventModel')
const Report = require('./reportModel')

const Schema = mongoose.Schema

const groupSchema = new Schema({
  activation: {
    type: String,
    enum: [ 'ACTIVE', 'BANNED' ],
    default: 'ACTIVE'
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  photo: {
    type: String,
    default: "https://i.ibb.co/k69tkmG/image9.jpg"
  },
  description: String,
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
  announcements: [{
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

module.exports = mongoose.model('Group', groupSchema)