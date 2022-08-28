const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 111
    },
    description: {
        type: String,
        required: true,

    },

    category: {
        type: [String],
        required: true,
    },
    numbOfLikes: {
        type: Number,

    },
    numbOfComments: {
        type: Number,

    },
    image: {
        type: String,
        default: ''
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true })


PostSchema.pre('remove', async function () {
    await this.model('Comment').deleteMany({ _id: this._id })
})

module.exports = mongoose.model('Post', PostSchema)