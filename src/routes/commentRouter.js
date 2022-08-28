const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const {
    createComment,
    updateComment,
    deleteComment,
    getComment
} = require('../controllers/commetController')


router
    .route('/')
    .post(auth, createComment)

router
    .route('/:id')
    .get(getComment)
    .patch(auth, updateComment)
    .delete(auth, deleteComment)

module.exports = router