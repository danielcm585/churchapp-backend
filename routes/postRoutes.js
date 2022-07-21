const express = require('express');

const post = require('../controllers/postController');
const { catchAsync } = require('../utils')
const { isLoggedIn, isPostCreator, isGroupMember, isAdmin } = require('../middleware');

const router = express.Router()

router.post('/', isLoggedIn, isAdmin, catchAsync(post.createMain))
router.post('/:id', isLoggedIn, isGroupMember, catchAsync(post.create))
router.post('/pin/:id', isLoggedIn, isGroupMember, catchAsync(post.pin))
router.get('/all', catchAsync(post.getAllMain))
router.get('/all/:id', isLoggedIn, isGroupMember, catchAsync(post.getAll))
router.get('/one/:id', catchAsync(post.getOne))
router.put('/:id', isLoggedIn, isPostCreator, catchAsync(post.edit))
router.delete('/:id', isLoggedIn, isPostCreator, catchAsync(post.delete))

module.exports = router