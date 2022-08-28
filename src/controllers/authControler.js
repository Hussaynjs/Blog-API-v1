const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors');
const { createTokenUser, attachCookiesToResponse } = require('../utils');


const register = async (req, res) => {
    const { name, email, password, age, occupation } = req.body;

    if (!name || !email || !password || !age || !occupation) {
        throw new CustomError.BadRequestError('please provide all values')
    }

    const acctAlreadyExist = await User.findOne({ email })

    if (acctAlreadyExist) {
        throw new CustomError.BadRequestError('email already in use')
    }

    const user = await User.create({ name, email, age, password, occupation })

    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })

    res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError.BadRequestError('please provide all values')
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new CustomError.UnauthenticatedError('invalid credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        throw new CustomError.UnauthenticatedError('invalid credentials')
    }
    const tokenUser = createTokenUser(user)
    attachCookiesToResponse({ res, user: tokenUser })
    res.status(StatusCodes.OK).json({ user: tokenUser })
}

const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(Date.now())

    })

    res.status(StatusCodes.OK).json({ msg: 'success! logged out' })
}

module.exports = {
    register,
    login,
    logout
}