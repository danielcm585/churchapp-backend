const Direct = require('../model/directModel')
const Post = require('../model/postModel') 

module.exports.create = async (req, res, next) => {
  const created = await Direct.find({ 
    members: { $in: [ req.user._id, req.body.user ] } 
  })
  if (created.length > 0) return res.status(400).json('Already created')
  const direct = new Direct({ members: [ req.user._id, req.body.user ] })
  await direct.save()
  res.status(200).json(direct)
}

module.exports.chat = async (req, res, next) => {
  const { id } = req.params
  const direct = await Direct.findById(id)
  const post = new Post({ creator: req.user._id, ...req.body })
  direct.chats.push(post)
  await direct.save()
  await post.save()
  res.status(200).json('Chat sent successfully')
}

module.exports.getOne = async (req, res, next) => {
  const { id } = req.params
  const direct = await Direct.findById(id)
  const pinned = direct.chats.filter(chat => chat.pinned)
  res.status(200).json({ ...direct, pinned: pinned })
}

module.exports.getMine = async (req, res, next) => {
  const { id } = req.params
  const directs = await Direct.find({ members: { $in: [ req.user._id ] } })
  res.status(200).json(directs)
}