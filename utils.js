const User = require('./models/userModel')
const Notification = require('./models/notificationModel')
const Link = require('./models/linkModel')

module.exports.catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next)
  }
}

module.exports.pushNotif = async (notifData, destination, userID) => {
  const link = new Link(destination)
  const notification = new Notification({ ...notifData, link })
  const user = await User.findById(userID)
  user.notifications.push(notification)
  await link.save()
  await notification.save()
  await user.save()
}