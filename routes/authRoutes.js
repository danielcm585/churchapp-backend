const express = require('express');

const auth = require('../controllers/authController')
const { isLoggedIn } = require('../middleware')
const { catchAsync } = require('../utils')

const router = express.Router()

router.post('/register', catchAsync(auth.register))
router.post('/login', catchAsync(auth.login))
router.post('/refresh', catchAsync(auth.refresh))
router.post('/logout', catchAsync(auth.logout))
router.put('/change-password', isLoggedIn, catchAsync(auth.changePassword))

module.exports = router