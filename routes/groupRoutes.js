const express = require('express');

const group = require('../controllers/groupController')
const { catchAsync } = require('../utils');
const { isLoggedIn, isGroupLeader, isGroupMember } = require('../middleware')

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(group.create))
router.get('/all', isLoggedIn, catchAsync(group.all))
router.get('/one/:id', isLoggedIn, isGroupMember, catchAsync(group.one))
router.post('/join/:id', isLoggedIn, catchAsync(group.join))
router.post('/accept-user/:id', isLoggedIn, isGroupLeader, catchAsync(group.acceptUser))
router.post('/reject-user/:id', isLoggedIn, isGroupLeader, catchAsync(group.rejectUser))
router.post('/accept-group/:id', isLoggedIn, catchAsync(group.acceptGroup))
router.post('/reject-group/:id', isLoggedIn, catchAsync(group.rejectGroup))
router.post('/invite/:id', isLoggedIn, isGroupLeader, catchAsync(group.invite))
router.post('/leave/:id', isLoggedIn, isGroupMember, catchAsync(group.leave))
router.put('/:id', isLoggedIn, isGroupLeader, catchAsync(group.edit))
router.delete('/:id', isLoggedIn, isGroupLeader, catchAsync(group.delete))

module.exports = router