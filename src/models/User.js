const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        required: true
    },
    profilePics: {
        type: String,
        default: ''
    },

    occupation: {
        type: String,
        required: true,
    }
})

UserSchema.virtual('posts', {
    ref: 'Post',
    localField: '_id',
    foreignField: 'user'
})

UserSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(8)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

UserSchema.pre('remove', async function () {
    await this.model('Post').deleteMany({ _id: this._id })
})

module.exports = mongoose.model('User', UserSchema)