const express = require('express');

const auth = require('../controllers/authController')
const { isLoggedIn } = require('../middleware')
const { catchAsync } = require('../utils')

const router = express.Router()

router.get('/get-verif', isLoggedIn, catchAsync(auth.getVerif))
router.get('/verify/:id', catchAsync(auth.verify))
router.post('/register', catchAsync(auth.register))
router.post('/login', catchAsync(auth.login))
router.post('/refresh', catchAsync(auth.refresh))
router.post('/logout', catchAsync(auth.logout))
router.put('/change-password', isLoggedIn, catchAsync(auth.changePassword))

module.exports = router