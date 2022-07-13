const User = require('../models/userModel')
const Report = require('../models/reportModel')

module.exports.create = async (req, res, next) => {
  const report = new Report({ ...req.body })
  await report.save()
  const userId = req.body.user
  if (userId != null) {
    const user = await User.findById(userId)
    user.reports.push(report)
    if (user.reports.length > 10) user.status = 'BANNED'
    await user.save()
    return res.status(200).json()
  }
  const postId = req.body.post
  if (postId != null) {
    const post = await Post.findById(postId)
    post.reports.push(report)
    if (post.reports.length > 10) post.status = 'BANNED'
    await post.save()
    return res.status(200).json()
  }
  const groupId = req.body.group
  if (groupId != null) {
    const group = await Group.findById(groupId)
    group.reports.push(report)
    if (group.reports.length > 10) group.status = 'BANNED';
    await group.save()
    return res.status(200).json()
  }
  res.status(400).json('No report found')
}