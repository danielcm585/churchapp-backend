const User = require('../models/userModel')
const Post = require('../models/postModel')
const Group = require('../models/groupModel')
const Report = require('../models/reportModel')

module.exports.create = async (req, res, next) => {
  const report = new Report({ ...req.body })
  await report.save()
  const userId = req.body.user
  if (userId != null) {
    const user = await User.findById(userId)
    user.reports.push(report)
    if (user.reports.length > 3) user.activation = 'SUSPENDED'
    if (user.reports.length > 5) user.activation = 'BANNED'
    await user.save()
    return res.status(200).json(report)
  }
  const postId = req.body.post
  if (postId != null) {
    const post = await Post.findById(postId)
    post.reports.push(report)
    if (post.reports.length > 3) post.activation = 'SUSPENDED'
    if (post.reports.length > 5) post.activation = 'BANNED'
    await post.save()
    return res.status(200).json(report)
  }
  const groupId = req.body.group
  if (groupId != null) {
    const group = await Group.findById(groupId)
    group.reports.push(report)
    if (group.reports.length > 3) group.activation = 'SUSPENDED'
    if (group.reports.length > 5) group.activation = 'BANNED';
    await group.save()
    return res.status(200).json(report)
  }
  res.status(400).json('No report found')
}