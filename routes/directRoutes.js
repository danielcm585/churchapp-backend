const express = require('express')

const direct = require('../controllers/directController')
const { isLoggedIn } = require('../middleware')
const { catchAsync } = require('../utils')

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(direct.chat))
router.get('/', isLoggedIn, catchAsync(direct.getMine))
router.get('/:id', isLoggedIn, catchAsync(direct.getOne))

module.exports = router