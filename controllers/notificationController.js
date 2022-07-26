const User = require('../models/userModel')
const Notification = require('../models/notificationModel')

module.exports.getAll = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  res.status(200).json(user.notifications)
}

module.exports.getOne = async (req, res, next) => {
  const { id } = req.params
  const notification = await Notification.findById(id)
  res.status(200).json(notification)
}

module.exports.readAll = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  for (let notifId of user.notifications) {
    await Notification.findByIdAndUpdate(notifId, { read: true })
  }
  res.status(200).json('All notification read')
}

module.exports.readOne = async (req, res, next) => {
  const { id } = req.params
  await Notification.findByIdAndUpdate(id, { read: true })
  res.status(200).json('Notification read successfully')
}