require('dotenv').config()

const User = require('../models/userModel')
const Post = require('../models/postModel')
const Group = require('../models/groupModel')

module.exports.create = async (req, res, next) => {
  const { id } = req.params
  const post = new Post({ ...req.body, group: id, creator: req.user })
  const group = await Group.findById(id)
  group.posts.push(post)
  await post.save()
  await group.save()
  res.status(200).json(post)
}

module.exports.createMain = async (req, res, next) => {
  const id = process.env.MAIN_GROUP_ID
  const post = new Post({ ...req.body, group: id, creator: req.user })
  const group = await Group.findById(id)
  group.posts.push(post)
  await post.save()
  await group.save()
  res.status(200).json(post)
}

module.exports.getAll = async (req, res, next) => {
  const { id } = req.params
  const group = await Group.findById(id).populate('posts',['_id','pinned'])
  const posts = group.posts.map(post => post._id)
  const pinned = group.posts.filter(post => post.pinned).map(post => post._id)
  res.status(200).json({ posts: posts, pinned: pinned })
}

module.exports.getAllMain = async (req, res, next) => {
  const group = await Group.findById(process.env.MAIN_GROUP_ID).populate('posts',['_id','pinned'])
  const posts = group.posts.map(post => post._id)
  const pinned = group.posts.filter(post => post.pinned).map(post => post._id)
  res.status(200).json({ posts: posts, pinned: pinned })
}

module.exports.getOne = async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findById(id).populate('creator', ['_id','name','photo'])
  res.status(200).json(post)
}

module.exports.pin = async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findByIdAndUpdate(id, { pinned: true })
  res.status(200).json(post)
}

module.exports.edit = async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findByIdAndUpdate(id, { ...req.body, editedAt: Date.now() })
  res.status(200).json(post)
}

module.exports.delete = async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findById(id)
  await Group.findByIdAndUpdate(post.group, { $pull: { posts: id } })
  await post.deleteOne()
  res.status(200).json('Post deleted successfully')
}