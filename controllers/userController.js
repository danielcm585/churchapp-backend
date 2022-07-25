const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const User = require('../models/userModel')
const Group = require('../models/groupModel')
const Session = require('../models/sessionModel')
const Notification = require('../models/notificationModel')

module.exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const { password, ...userData } = user._doc
  res.status(200).json(userData)
}

module.exports.getOne = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(id)
  const { password, ...userData } = user._doc
  res.status(200).json(userData)
}

module.exports.getAll = async (req, res, next) => {
  let users = await User.find()
  users = users.map(user => {
    const { password, ...userData } = user._doc
    return userData
  })
  res.status(200).json(users)
}

module.exports.edit = async (req, res, next) => {
  if (req.email) {
    const sameEmail = await User.findOne({ email: req.email })
    if (sameEmail) return res.status(400).json('Email already in use')
  }
  if (req.username) {
    const sameUsername = await User.findOne({ username: req.username })
    if (sameUsername) return res.status(400).json('Username already in use')
  }
  const user = await User.findByIdAndUpdate(req.user._id, { ...req.body, editedAt: Date.now() })
  res.status(200).json(user)
}

module.exports.delete = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  await Group.findByIdAndUpdate(process.env.MAIN_GROUP_ID, { $pull: { members: req.user._id } })
  await user.deleteOne()
  res.status(200).json('User deleted')
}