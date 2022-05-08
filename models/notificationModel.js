const mongoose = require('mongoose');

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
  destination: {
    type: String,
    enum: [ 'INVITATION', 'REQUEST', 'GROUP', 'EVENT', 'DIRECT', 'NONE' ]
  },
  link: String
})

module.exports = mongoose.model('Notification', notificationSchema)