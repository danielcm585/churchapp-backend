const Group = require('../models/groupModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const Event = require('../models/eventModel')
const { pushNotif } = require('../utils')

module.exports.create = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  const group = new Group({ ...req.body })
  group.leaders.push(user)
  group.members.push(user)
  user.groups.push(group)
  await user.save()
  await group.save()
  res.status(200).json(group)
}

module.exports.getAll = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('groups')
  res.status(200).json(user.groups)
}

module.exports.getOne = async (req, res, next) => {
  const { id } = req.params
  const group = await Group.findById(id)
  await group.populate('leaders','-password')
  await group.populate('members','-password')
  await group.populate('pendings','-password')
  await group.populate('invites','-password')
  await group.populate('top')
  await group.populate('posts')
  await group.populate('events')
  res.status(200).json(group)
}

module.exports.join = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(req.user._id)
  const group = await Group.findById(id)
  console.log(group.status)
  if (group.status === 'PUBLIC') {
    group.members.push(user)
    user.groups.push(group)
    for (member of group.members) {
      if (member._id == user._id) continue
      pushNotif({
        title: `${user.name} has just joined ${group.name}`,
        body: 'Please welcome our new member',
        destination: 'Group',
        link: { group: group._id }
      }, member._id)
    }
    pushNotif({
      title: `You are accepted to ${group.name}`,
      body: 'Please introduce yourself to the group',
      destination: 'Group',
      link: { group: group._id }
      // TODO: Give link to group page
    }, user._id)
  }
  else {
    group.pendings.push(user)
    for (leader of group.leaders) {
      pushNotif({
        title: `${user.name} requested to join ${group.name}`,
        body: 'Please accept the new pending member',
        destination: 'REQUEST',
        link: { group: group._id, user: user._id }
      }, leader._id)
    }
  }
  await group.save()
  await user.save()
  res.status(200).json('Joined group successfully')
}

module.exports.acceptUser = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(req.body.user)
  const group = await Group.findById(id)
  if (!group.pendings.includes(user._id)) return res.status(403).json('User not found in pending list')
  group.pendings.pull(user._id)
  group.members.push(user)
  user.groups.push(group)
  await group.save()
  for (member of group.members) {
    if (member._id == user._id) continue
    pushNotif({
      title: `${user.name} has just joined ${group.name}`,
      body: 'Please welcome our new member',
      destination: 'GROUP',
      link: { group: group._id }
    }, member._id)
  }
  pushNotif({
    title: `You are accepted to ${group.name}`,
    body: 'Please introduce yourself to the group',
    destination: 'GROUP',
    link: { group: group._id }
  }, user._id)
  res.status(200).json('Pending user accepted successfully')
}

module.exports.rejectUser = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(req.body.user)
  const group = await Group.findById(id)
  if (!group.pendings.includes(user._id)) return res.status(403).json('User not found in pending list')
  group.pendings.pull(user._id)
  await group.save()
  pushNotif({
    title: `You are rejected to ${group.name}`,
    body: 'Please contact the group leaders',
    destination: 'NONE', // FIXME: Redirect to group leader DM
  }, user._id)
  res.status(200).json('Pending user rejected successfully')
}

module.exports.acceptGroup = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(req.user._id)
  const group = await Group.findById(id)
  if (!group.invites.includes(user._id)) return res.status(403).json('Not invited')
  group.invites.pull(user._id)
  user.invites.pull(group._id)
  group.members.push(user)
  user.groups.push(group)
  for (member of group.members) {
    if (member._id == user._id) continue
    pushNotif({
      title: `${user.name} has just joined ${group.name}`,
      body: 'Please welcome our new member',
      destination: 'GROUP',
      link: { group: group._id }
    }, member._id)
  }
  await group.save()
  await user.save()
  res.status(200).json('Accepted group successfully')
}

module.exports.rejectGroup = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(req.user._id)
  const group = await Group.findById(id)
  if (!group.invites.includes(user._id)) return res.status(403).json('Not invited')
  group.invites.pull(user._id)
  user.invites.pull(group._id)
  for (leader of group.leaders) {
    pushNotif({
      title: `${user.name} has just rejected the invitation to ${group.name}`,
      body: 'Please follow up him/her',
      destination: 'DIRECT',
      link: { user: user._id }
    }, leader._id)
  }
  await group.save()
  res.status(200).json('Rejected group successfully')
}

module.exports.invite = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findById(req.body.user)
  const group = await Group.findById(id)
  group.invites.push(user)
  user.invites.push(group)
  await group.save()
  await user.save()
  pushNotif({
    title: `You are invited to ${group.name}`,
    body: 'Please accept the invitation',
    destination: 'INVITATION',
    link: { group: group._id }
  }, user._id)
  res.status(200).json('Invitation sent successfully')
}

module.exports.leave = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(req.user._id, { $pull: { groups: id } })
  const group = await Group.findByIdAndUpdate(id, { $pull: { members: req.user._id } })
  for (leader of group.leaders) {
    pushNotif({
      title: `${user.name} has just left ${group.name}`,
      body: 'Please contact him/her immediately',
      destination: 'DIRECT',
      link: { user: user._id }
    }, leader._id)
  }
  res.status(200).json('Left group successfully')
}

module.exports.edit = async (req, res, next) => {
  const { id } = req.params
  if (req.body.password) return res.status(403).json('Wrong route to change password')
  const group = Group.findByIdAndUpdate(id, { ...req.body, editedAt: Date.now() })
  res.status(200).json(group)
}

module.exports.delete = async (req, res, next) => {
  const { id } = req.params
  const group = await Group.findById(id)
  for (let user of group.members) {
    await User.findByIdAndUpdate(user._id, { $pull: { groups: id } })
  }
  await group.deleteOne()
  res.status(200).json('Group deleted successfully')
}