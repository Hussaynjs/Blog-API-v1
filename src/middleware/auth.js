const CustomError = require('../errors');
const { isTokenValid } = require('../utils');

const auth = async (req, res, next) => {
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomError.UnauthenticatedError('invalid authentication')
    }
    try {
        const { name, userId, occupation, age } = isTokenValid({ token })
        req.user = { name, userId, occupation, age }
        next()

    } catch (error) {
        throw new CustomError.UnauthenticatedError('invalid authentication')
    }

}

module.exports = auth