const express = require('express');

const group = require('../controllers/groupController')
const { catchAsync } = require('../utils');
const { isLoggedIn, isGroupLeader, isGroupMember } = require('../middleware');

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(group.create))
router.get('/', isLoggedIn, catchAsync(group.getAll))
router.get('/mine', isLoggedIn, catchAsync(group.getMine))
router.get('/:id', isLoggedIn, isGroupMember, catchAsync(group.getOne))
router.post('/join/:id', isLoggedIn, catchAsync(group.join))
router.post('/accept-user/:id', isLoggedIn, isGroupLeader, catchAsync(group.acceptUser))
router.post('/reject-user/:id', isLoggedIn, isGroupLeader, catchAsync(group.rejectUser))
router.post('/accept-group/:id', isLoggedIn, catchAsync(group.acceptGroup))
router.post('/reject-group/:id', isLoggedIn, catchAsync(group.rejectGroup))
router.post('/make-leader/:id', isLoggedIn, isGroupLeader, catchAsync(group.makeLeader))
router.post('/invite/:id', isLoggedIn, isGroupLeader, catchAsync(group.invite))
router.post('/leave/:id', isLoggedIn, isGroupMember, catchAsync(group.leave))
router.put('/:id', isLoggedIn, isGroupLeader, catchAsync(group.edit))
router.delete('/:id', isLoggedIn, isGroupLeader, catchAsync(group.delete))

module.exports = router