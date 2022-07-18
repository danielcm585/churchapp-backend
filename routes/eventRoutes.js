const express = require('express')

const event = require('../controllers/eventController')
const { catchAsync } = require('../utils')
const { isLoggedIn, isEventCreator, isGroupMember } = require('../middleware');

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(event.create))
router.get('/all/:id', isLoggedIn, isGroupMember, catchAsync(event.all))
router.get('/one/:id', isLoggedIn, isGroupMember, catchAsync(event.one))
router.put('/:id', isLoggedIn, isEventCreator, catchAsync(event.edit))
router.delete('/:id', isLoggedIn, isEventCreator, catchAsync(event.delete))

module.exports = router