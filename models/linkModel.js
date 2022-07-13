const mongoose = require('mongoose')

const Schema = mongoose.Schema

const linkSchema = new Schema({
  page: String,
  id: String
})

module.exports = mongoose.model('Link', linkSchema)