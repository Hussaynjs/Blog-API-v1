const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../models/User')
const { attachCookiesToResponse, createTokenUser } = require('../utils')

const userProfile = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId }).select('-password')
    res.status(StatusCodes.OK).json({ user })
    // res.status(StatusCodes.OK).json({ user: req.user })
}

// const getSingleUser = async (req, res) => {
//     const { id: userId } = req.params
//     const user = await User.findOne({ _id: userId }).select('-password')

//     if (!user) {
//         throw new CustomError.NotFoundError(`no user with id: ${userId}`)
//     }

//     res.status(StatusCodes.OK).json({ user })
// }

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['name', 'email', 'age', 'occupation', 'profilePics']
    const isValidUpdates = updates.every((update) => validUpdates.includes(update))

    if (!isValidUpdates) {
        throw new CustomError.BadRequestError('invalid updates')
    }

    const user = await User.findOne({ _id: req.user.userId })

    updates.forEach((update) => user[update] = req.body[update])
    await user.save()
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.OK).json({ msg: 'profile successfully updates' })
}

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body

    if (!oldPassword || !newPassword || !confirmNewPassword) {
        throw new CustomError.BadRequestError('please provide all values')
    }

    const user = await User.findOne({ _id: req.user.userId })

    const isPasswordCorrect = await user.comparePassword(oldPassword)

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('incorrect password')
    }

    if (newPassword !== confirmNewPassword) {
        throw new CustomError.BadRequestError('please provide correct password')

    }

    user.password = newPassword
    await user.save()

    res.status(StatusCodes.OK).json({ msg: 'password successfully changed' })
}

const deleteAcct = async (req, res) => {
    const user = await User.findOne({ _id: req.user.userId })
    await user.remove()
    res.status(StatusCodes.OK).json({ msg: 'account deleted' })
}

module.exports = {
    updateUser,
    userProfile,
    updateUserPassword,
    deleteAcct
}