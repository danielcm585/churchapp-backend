const express = require('express')

const prayer = require('../controllers/prayerController')
const { catchAsync } = require('../utils')
const { isLoggedIn, isAdmin, isPrayerCreatorOrAdmin, isPostCreator } = require('../middleware')

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(prayer.create))
router.get('/all', isLoggedIn, isAdmin, catchAsync(prayer.getAll))
router.get('/mine', isLoggedIn, catchAsync(prayer.getMine))
router.get('/one/:id', isLoggedIn, isPrayerCreatorOrAdmin, catchAsync(prayer.getOne))
router.put('/:id', isLoggedIn, isPostCreator, catchAsync(prayer.edit))

module.exports = router