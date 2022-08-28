const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const {
    updateUser,
    userProfile,
    updateUserPassword,
    deleteAcct
} = require('../controllers/userControler')

const { currentUserPosts } = require('../controllers/postController')

router
    .route('/profile')
    .get(auth, userProfile)


router
    .route('/update-profile')
    .patch(auth, updateUser)

router
    .route('/update-password')
    .patch(auth, updateUserPassword)

router
    .route('/delete-account')
    .delete(auth, deleteAcct)

router.route('/:id/posts').get(currentUserPosts)


module.exports = router