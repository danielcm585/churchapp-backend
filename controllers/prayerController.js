const Prayer = require('../models/prayerModel')

module.exports.create = async (req, res, next) => {
  const prayer = new Prayer({ ...req.body, creator: req.user._id })
  prayer.save()
  res.status(200).json(prayer)
}

module.exports.getAll = async (req, res, next) => {
  const prayers = Prayer.find()
  const undone = prayers.filter(prayer => prayer.status === 'UNDONE')
  const done = prayers.filter(prayer => prayer.status === 'DONE')
  res.status(200).json({ undone: undone, done: done })
}

module.exports.getOne = async (req, res, next) => {
  const { id } = req.params
  const prayer = Prayer.findById(id)
  res.status(200).json(prayer)
}

module.exports.getMine = async (req, res, next) => {
  const prayers = Prayer.find({ creator: req.user._id })
  const undone = prayers.filter(prayer => prayer.status === 'UNDONE')
  const done = prayers.filter(prayer => prayer.status === 'DONE')
  res.status(200).json({ undone: undone, done: done })
}

module.exports.edit = async (req, res, next) => {
  const { id } = req.params
  if (req.body.creator != null) res.status(400).json('Cannot change creator')
  const prayer = Prayer.findByIdAndUpdate(id, { ...req.body, editedAt: Date.now() })
  prayer.save()
  res.status(200).json(prayer)
}