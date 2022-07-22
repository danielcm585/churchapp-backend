const express = require('express')

const direct = require('../controllers/directController')
const { isLoggedIn } = require('../middleware')
const { catchAsync } = require('../utils')

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(direct.create))
router.post('/:id', isLoggedIn, isTalking, catchAsync(direct.chat))
router.get('/:id', isLoggedIn, isTalking, catchAsync(direct.getOne))
router.get('/mine/:id', isLoggedIn, catchAsync(direct.getMine))

module.exports = router