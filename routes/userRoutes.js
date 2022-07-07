const express = require('express');

const user = require('../controllers/userController')
const { catchAsync } = require('../utils');
const { isLoggedIn } = require('../middleware');

const router = express.Router()

router.post('/register', catchAsync(user.register))
router.post('/login', catchAsync(user.login))
router.post('/refresh', catchAsync(user.refresh))
router.delete('/logout', catchAsync(user.logout))
router.get('/me', isLoggedIn, catchAsync(user.getMe))
router.get('/one', isLoggedIn, catchAsync(user.getOne))
router.get('/all', isLoggedIn, catchAsync(user.getAll))
router.put('/', isLoggedIn, catchAsync(user.edit))
router.put('/change-password', isLoggedIn, catchAsync(user.changePassword))
router.delete('/', isLoggedIn, catchAsync(user.delete))

module.exports = router