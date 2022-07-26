require('dotenv').config()

const Event = require('../models/eventModel')
const Group = require('../models/groupModel')

module.exports.create = async (req, res, next) => {
  req.body.group = req.body.group || process.env.MAIN_GROUP_ID
  const event = new Event({ ...req.body, creator: req.user._id })
  const group = await Group.findById(req.body.group)
  group.events.push(event)
  await event.save()
  await group.save()
  res.status(200).json(event)
}

module.exports.all = async (req, res, next) => {
  const { id } = req.params
  const events = await Event.find({ group: id }).populate('creator',['_id','name','photo'])
  res.status(200).json(events)
}

module.exports.one = async (req, res, next) => {
  const { id } = req.params
  const event = await Event.findById(id).populate('creator',['_id','name','photo'])
  res.status(200).json(event)
}

module.exports.edit = async (req, res, next) => {
  const { id } = req.params
  const event = await Event.findByIdAndUpdate(id, { ...req.body, editedAt: Date.now() })
  res.status(200).json(event)
}

module.exports.delete = async (req, res, next) => {
  const { id } = req.params
  const event = await Event.findById(id)
  await Group.findByIdAndUpdate(event.group, { $pull: { events: id } })
  event.deleteOne()
  res.status(200).json('Event deleted successfully')
}