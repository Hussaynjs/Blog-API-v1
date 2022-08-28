const UnauthenticatedError = require('./unauthenticate')
const NotFoundError = require('./not-found')
const UnauthorizedError = require('./unAuthourize')
const CustomAPIError = require('./custom-api')
const BadRequestError = require('./bad-request')



module.exports = {
    UnauthenticatedError,
    NotFoundError,
    UnauthorizedError,
    CustomAPIError,
    BadRequestError
}