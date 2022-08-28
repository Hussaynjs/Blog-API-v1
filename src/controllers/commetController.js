const Comment = require('../models/Comment')
const Post = require('../models/Post')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')


const createComment = async (req, res) => {

    const { post: postId } = req.body;

    const isValidPost = await Post.findOne({ _id: postId })

    if (!isValidPost) {
        throw new CustomError.NotFoundError(`no post with id : ${postId}`)
    }

    req.body.user = req.user.userId;
    const comment = await Comment.create(req.body)
    res.status(StatusCodes.CREATED).json({ comment })
}

const getComment = async (req, res) => {
    const { id: commentId } = req.params;
    const comment = await Comment.findOne({ _id: commentId }).populate({
        path: 'user',
        select: 'name profilePics occupation'
    })

    if (!comment) {
        throw new CustomError.NotFoundError(`no post with id : ${commentId}`)
    }

    res.status(StatusCodes.OK).json({ comment })
}


const getPostComments = async (req, res) => {
    const { id: postId } = req.params;
    const comments = await Comment.find({ post: postId })
    res.status(StatusCodes.OK).json({ comments })
}

const updateComment = async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['comment', 'like']
    const isValidUpdates = updates.every((update) => validUpdates.includes(update))
    const { id: commentId } = req.params;

    if (!isValidUpdates) {
        throw new CustomError.BadRequestError('invalid updates')
    }

    const comment = await Comment.findOne({ _id: commentId })

    if (!comment) {
        throw new CustomError.NotFoundError(`no post with id : ${commentId}`)
    }

    updates.forEach((update) => comment[update] = req.body[update])

    res.status(StatusCodes.OK).json({ comment })
}


const deleteComment = async (req, res) => {
    const { id: commentId } = req.params;
    const comment = await Comment.findOne({ _id: commentId })

    if (!comment) {
        throw new CustomError.NotFoundError(`no post with id : ${commentId}`)
    }
    await comment.remove()

    res.status(StatusCodes.OK).json({ msg: 'comments deleted' })
}

module.exports = {
    createComment,
    getPostComments,
    updateComment,
    deleteComment,
    getComment
}

