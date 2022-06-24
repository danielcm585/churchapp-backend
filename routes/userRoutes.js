const express = require('express');

const user = require('../controllers/userController')
const { catchAsync } = require('../utils');
const { isLoggedIn } = require('../middleware');

const router = express.Router()

router.post('/register', catchAsync(user.register))
router.post('/login', catchAsync(user.login))
router.post('/refresh', catchAsync(user.refresh))
router.delete('/logout', catchAsync(user.logout))
router.put('/', isLoggedIn, catchAsync(user.edit))
router.delete('/', isLoggedIn, catchAsync(user.delete))

module.exports = router