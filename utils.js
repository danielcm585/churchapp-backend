const User = require('./models/userModel')
const Notification = require('./models/notificationModel')

module.exports.catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next)
  }
}

module.exports.pushNotif = async (notifData, userID) => {
  const notification = new Notification(notifData)
  const user = await User.findById(userID)
  user.notifications.push(notification)
  await notification.save()
  await user.save()
}