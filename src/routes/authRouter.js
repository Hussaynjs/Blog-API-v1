const express = require('express')
const router = express.Router()
const {
    register,
    login,
    logout
} = require('../controllers/authControler')

router.post('/register', register)
router.post('/login', login)
router.delete('/logout', logout)


module.exports = router