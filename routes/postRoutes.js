const express = require('express');

const post = require('../controllers/postController');
const { catchAsync } = require('../utils')
const { isLoggedIn, isPostCreator, isGroupMember } = require('../middleware');

const router = express.Router()

router.post('/', isLoggedIn, catchAsync(post.create))
router.get('/:id', isLoggedIn, isGroupMember, catchAsync(post.all))
router.put('/:id', isLoggedIn, isPostCreator, catchAsync(post.edit))
router.delete('/:id', isLoggedIn, isPostCreator, catchAsync(post.delete))

module.exports = router