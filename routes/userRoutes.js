const express = require('express');

const user = require('../controllers/userController')
const { catchAsync } = require('../utils')
const { isLoggedIn } = require('../middleware')

const router = express.Router()

router.get('/', catchAsync(user.getAll))
router.get('/me', isLoggedIn, catchAsync(user.getMe))
router.get('/:id', catchAsync(user.getOne))
router.put('/', isLoggedIn, catchAsync(user.edit))
router.delete('/', isLoggedIn, catchAsync(user.delete))

module.exports = router