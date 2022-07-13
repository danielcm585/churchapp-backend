const express = require('express')

const report = require('../controllers/reportController')
const { isLoggedIn } = require('../middleware')
const { catchAsync } = require('../utils')

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(report.create))

module.exports = router