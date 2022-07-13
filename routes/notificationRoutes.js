const express = require('express')

const notification = require('../controllers/notificationController')
const { catchAsync } = require('../utils')
const { isLoggedIn } = require('../middleware')

const router = express.Router()

router.get('/', isLoggedIn, catchAsync(notification.getAll))
router.post('/', isLoggedIn, catchAsync(notification.readAll))
router.post('/:id', isLoggedIn, catchAsync(notification.readOne))

module.exports = router