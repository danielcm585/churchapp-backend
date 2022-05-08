const express = require('express')

const notification = require('../controllers/notificationController')
const { catchAsync } = require('../utils')
const { isLoggedIn } = require('../middleware')

const router = express.Router()

router.post('/all', isLoggedIn, catchAsync(notification.all))
router.post('/one/:id', isLoggedIn, catchAsync(notification.one))

module.exports = router