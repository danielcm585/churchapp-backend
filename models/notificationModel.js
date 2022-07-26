const mongoose = require('mongoose')

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
  action: {
    accept: String,
    reject: String
  },
  link: {
    page: String,
    id: String
  }
})

module.exports = mongoose.model('Notification', notificationSchema)