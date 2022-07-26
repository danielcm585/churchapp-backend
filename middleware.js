const jwt = require('jsonwebtoken')
require('dotenv').config()

const Group = require('./models/groupModel')
const Post = require('./models/postModel')
const Event = require('./models/eventModel')
const User = require('./models/userModel')
const Direct = require('./models/directModel')

module.exports.isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json('You must be logged in')
  try {
    const user = jwt.verify(token, process.env.TOKEN)
    const userData = await User.findById(user._id)
    req.user = userData
  }
  catch (err) {
    return res.status(401).json('Token expired')        
  }
  next()
}

module.exports.isActive = async (req, res, next) => {
  if (req.user.activation !== 'ACTIVE') return res.status(401).json('You must activate your account')
  next()
}

module.exports.isGroupLeader = async (req, res, next) => {
  const { id } = req.params
  const group = await Group.findById(id)
  if (!group.leaders.includes(req.user._id)) 
    return res.status(403).json('You are not the group leader')
  next()
}

module.exports.isGroupMember = async (req, res, next) => {
  const { id } = req.params
  const group = await Group.findById(id)
  if (!group.members.includes(req.user._id)) 
    return res.status(403).json('You are not the group member')
  next()
}

module.exports.isPostCreator = async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findById(id)
  if (post.creator !== req.user._id)
    return res.status(403).json('You are not the post creator')
  next()
}

module.exports.isEventCreator = async (req, res, next) => {
  const { id } = req.params
  const event = await Event.findById(id)
  if (event.creator !== req.user._id)
    return res.status(403).json('You are not the event creator')
  next()
}

module.exports.isTalking = async (req, res, next) => {
  const { id } = req.params
  const direct = await Direct.findById(id)
  if (!direct.members.include(req.user._id))
    return res.status(403).json('You are not the talking member')
  next()
}

module.exports.isAdmin = async (req, res, next) => {
  if (req.user.role !== 'ADMIN')
    return res.status(403).json('You are not an administrator')
  next()
}