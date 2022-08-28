const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const {
    createPost,
    getPost,
    updatePost,
    getPosts,
    deletePost,
    uploadImgPost
} = require('../controllers/postController')

const { getPostComments } = require('../controllers/commetController')

router
    .route('/')
    .get(getPosts)
    .post(auth, createPost)


router
    .route('/upload')
    .post(auth, uploadImgPost)

router
    .route('/:id/comments')
    .get(getPostComments)

router
    .route('/:id')
    .get(getPost)
    .patch(auth, updatePost)
    .delete(auth, deletePost)

module.exports = router