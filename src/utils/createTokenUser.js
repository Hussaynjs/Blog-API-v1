const createTokenUser = (user) => {
    return { name: user.name, userId: user._id, occupation: user.occupation, age: user.age }
}

module.exports = createTokenUser