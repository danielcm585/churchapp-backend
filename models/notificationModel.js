const mongoose = require('mongoose')

const Link = require('./linkModel')

const Schema = mongoose.Schema

const notificationSchema = new Schema({
  read: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  link: {
    type: Schema.Types.ObjectId,
    ref: 'Link'
  }
})

module.exports = mongoose.model('Notification', notificationSchema)