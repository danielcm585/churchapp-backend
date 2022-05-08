module.exports.all = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  for (let notification of user.notifications) {
    await Notif.findByIdAndUpdate(notification, { read: true })
  }
  res.status(200).json('All notification read')
}

module.exports.one = async (req, res, next) => {
  const { id } = await User.findById(req.user._id)
  await Notif.findByIdAndUpdate(id, { read: true })
  res.status(200).json('Notification read successfully')
}