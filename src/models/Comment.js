const mongoose = require('mongoose')


const CommentsSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    like: {
        type: Number,
        max: 1,
        min: 0,
        default: 0
    },
    post: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Post'
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, { timestamps: true })

CommentsSchema.statics.calcAvgLikesAndComments = async function (postId) {
    const result = await this.aggregate([
        { $match: { post: postId } },
        {
            $group: {
                _id: null,
                numbOfLikes: { sum: 1 },
                numbOfComments: { $avg: '$comment' }
            }
        }
    ])

    try {
        await this.model('Post').findOneAndUpdate(
            { _id: postId },
            {
                numbOfLikes: result[0]?.numbOfLikes || 0,
                numbOfComments: result[0]?.numbOfLikes || 0
            }
        )
    } catch (error) {

    }
}

CommentsSchema.post('save', async function () {
    await this.constructor.calcAvgLikesAndComments(this.post)
})

CommentsSchema.post('remove', async function () {
    await this.constructor.calcAvgLikesAndComments(this.post)
})

module.exports = mongoose.model('Comment', CommentsSchema)