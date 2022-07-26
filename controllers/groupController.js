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
  const groups = await Group.find()
  res.status(200).json(groups)
}

module.exports.getMine = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('groups',['_id','name','description','photo']) 
  res.status(200).json(user.groups)
}

module.exports.getOne = async (req, res, next) => {
  const { id } = req.params
  const group = await Group.findById(id)
    .populate('members',['_id','name','photo'])
    .populate('leaders',['_id','name','photo'])
    .populate('pendings',['_id','name','photo'])
    .populate('invites',['_id','name','photo'])
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
      if (member._id === user._id) continue
      pushNotif({
        title: `${user.name} baru saja bergabung di grup ${group.name}`,
        body: 'Ayo sambut saudara baru!',
        link: {
          page: 'Group',
          id: group._id
        }
      }, member._id)
    }
    pushNotif({
      title: `Permintaan masuk grup ${group.name} anda telah diterima`,
      body: 'Silakan memperkenalkan diri saudara',
      link: {
        page: 'Group',
        id: group._id
      }
    }, user._id)
  }
  else {
    group.pendings.push(user)
    for (leader of group.leaders) {
      pushNotif({
        title: `${user.name} meminta untuk bergabung di grup ${group.name}`,
        body: 'Tolong terima/tolak permintaan mereka',
        link: {
          page: 'GroupDetails',
          id: group._id
        }
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
    if (member._id === user._id) continue
    pushNotif({
      title: `${user.name} telah bergabung di grup ${group.name}`,
      body: 'Sambut mereka yang baru bergabung',
      link: {
        page: 'Group',
        id: group._id
      }
    }, member._id)
  }
  pushNotif({
    title: `Permintaan masuk grup ${group.name} anda telah diterima`,
    body: 'Silakan memperkenalkan diri saudara',
    link: {
      page: 'Group',
      id: group._id
    }
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
    title: `Permintaan masuk grup ${group.name} anda ditolak`,
    body: 'Hubungi leader grup untuk informasi lebih lanjut'
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
    if (member._id === user._id) continue
    pushNotif({
      title: `${user.name} baru saja bergabung di grup ${group.name}`,
      body: 'Ayo sambut saudara baru!',
      link: {
        page: 'Group',
        id: group._id
      }
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
  if (!group.invites.includes(user._id)) return res.status(400).json('Not invited')
  group.invites.pull(user._id)
  user.invites.pull(group._id)
  for (leader of group.leaders) {
    pushNotif({
      title: `${user.name} baru saja menolak undangan grup ${group.name}`,
      body: 'Tolong hubungi mereka kembali',
      link: {
        page: 'Profile',
        id: user._id
      }
    }, leader._id)
  }
  await group.save()
  res.status(200).json('Rejected group successfully')
}

module.exports.makeLeader = async (req, res, next) => {
  const { id } = req.params
  const group = await Group.findById(id)
  if (group.leaders.includes(req.body.user)) return res.status(400).json('Already a leader')
  group.leaders.push(req.body.user)
  pushNotif({
    title: `Kamu telah ditunjuk sebagai leader di grup ${group.name}`,
    body: 'Selamat melayani! Tuhan Yesus memberkati',
    link: {
      page: 'GroupDetails',
      id: group._id
    }
  }, id)
  await group.save()
  res.status(200).json('Successfully make leader')
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
    title: `Anda menerima undangan ke grup ${group.name}`,
    body: 'Tolong terima/tolak undangan',
    link: {
      page: 'Notification',
      id: group._id
    }
  }, user._id)
  res.status(200).json('Invitation sent successfully')
}

module.exports.leave = async (req, res, next) => {
  const { id } = req.params
  const user = await User.findByIdAndUpdate(req.user._id, { $pull: { groups: id } })
  const group = await Group.findByIdAndUpdate(id, { $pull: { members: req.user._id } })
  for (leader of group.leaders) {
    pushNotif({
      title: `${user.name} baru saja meninggalkan grup ${group.name}`,
      body: 'Segera hubungi mereka',
      link: {
        page: 'Profile',
        id: user._id
      }
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
    pushNotif({
      title: `Grup ${group.name} telah dihapus`,
      body: 'Silakan hubungi leader grup untuk informasi lebih lanjut'
    }, user._id) // TODO: Check me!
    await User.findByIdAndUpdate(user._id, { $pull: { groups: id } })
  }
  await group.deleteOne()
  res.status(200).json('Group deleted successfully')
}