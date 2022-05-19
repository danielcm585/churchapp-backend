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

module.exports.all = async (req, res, next) => {
  const { id } = req.params
  const posts = await Post.find({ group: id }).populate('creator')
  res.status(200).json(posts)
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