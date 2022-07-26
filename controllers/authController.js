const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const axios = require('axios')
const twilio = require('twilio')
require('dotenv').config()

const User = require('../models/userModel')
const Group = require('../models/groupModel')
const Session = require('../models/sessionModel')
const Notification = require('../models/notificationModel')
const Verification = require('../models/verificationModel')

module.exports.register = async (req, res, next) => {
  const user = new User({ ...req.body })
  if (user.password.length < 6) res.status(400).json('Password must be at least 6 characters')
  const sameUsername = await User.findOne({ username: user.username })
  if (sameUsername) return res.status(400).json('Username already in use')
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    user.password = hashedPassword
  }
  catch (err) {
    res.status(500).json(`Error: ${err.message}`)
  }
  const group = await Group.findById(process.env.MAIN_GROUP_ID)
  group.members.push(user)
  user.groups.push(group)
  await group.save()
  await user.save()
  this.login({
    body: {
      username: req.body.username,
      password: req.body.password
    }
  }, res)
}

module.exports.getVerif = async (req, res, next) => {
  try {
    const verification = new Verification({ user: req.user })
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
    await client.messages.create({
      body: `Activate your account by simply clicking on ${process.env.API_URL}/auth/verify/${verification._id}`,
      to: req.user.phone,
      from: process.env.SUPPORT_PHONE,
    })
    res.status(200).json('Verification link sent')
  }
  catch (err) {
    console.log(err.message)
    return res.status(500).json(`Error: ${err.message}`)
  }
}

module.exports.verify = async (req, res, next) => {
  const { id } = req.params
  const verification = await Verification.findById(id)
  if (getDifferenceInMinutes(new Date.now(), verification.createdAt) > 5)
    return res.status(401).json('Verification link expired')
  const user = await User.findById(verification.user._id)
  user.acitivation = 'ACTIVE'
  await user.save()
  res.status(200).json('User account activated')
}

module.exports.login = async (req, res, next) => {
  const user = await User.findOne({ username: req.body.username })
  if (!user) return res.status(403).json('User not found')
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) res.status(400).json('Wrong password')
  await user.populate('notifications')
  const { password, ...userData } = user._doc
  const token = jwt.sign({ _id: userData._id }, process.env.TOKEN, { expiresIn: '1000s' })
  const refreshToken = jwt.sign({ _id: userData._id }, process.env.REFRESH_TOKEN)
  const session = new Session({ token: refreshToken })
  await session.save()
  res.status(200).json({ token: token, refreshToken: refreshToken, user: userData })
}

module.exports.refresh = async (req, res, next) => {
  const refreshToken = req.body.token
  if (!refreshToken) return res.status(401).json('Invalid refresh token')
  const session = await Session.findOne({ token: refreshToken })
  if (!session) return res.status(403).json('Refresh token not found')
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.send(403).json(err.message)
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN, { expiresIn: '1000s' })
    res.status(200).json({ token: token })
  })
}

module.exports.logout = async (req, res, next) => {
  const token = req.body.token
  Session.findOneAndDelete({ token: token })
  res.status(200).json('Logged out successfully')
}

module.exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    const validPassword = await bcrypt.compare(req.body.oldPassword, user.password)
    if (!validPassword) return res.status(400).json('Wrong old password')
    if (req.body.newPassword.length < 6) 
      return res.status(400).json('Password must be at least 6 characters')
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10)
    user.password = hashedPassword
    await user.save()
    res.status(200).json('Password changed')
  }
  catch (err) {
    res.status(500).json(`Error: ${err.message}`)
  }
}