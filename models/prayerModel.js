const mongoose = require('mongoose')

const User = require('../models/userModel')

const Schema = mongoose.Schema

const prayerSchema = new Schema({
  status: {
    type: String,
    enum: [ 'UNDONE', 'DONE' ],
    default: 'UNDONE'
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User'
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

module.exports = mongoose.model('Prayer', prayerSchema)