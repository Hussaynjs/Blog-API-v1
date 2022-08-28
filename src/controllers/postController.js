const Post = require('../models/Post')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')


const createPost = async (req, res) => {
    req.body.user = req.user.userId;

    const post = await Post.create(req.body);
    res.status(StatusCodes.CREATED).json({ post })
}

const getPosts = async (req, res) => {
    const posts = await Post.find({}).populate({
        path: 'user',
        select: 'name profilepics occupation'
    })
    res.status(StatusCodes.OK).json({ numbOfHits: posts.length, posts })
}

const currentUserPosts = async (req, res) => {
    const { id: userId } = req.params;
    const posts = await Post.find({ user: userId })
    res.status(StatusCodes.OK).json({ posts })
}

const getPost = async (req, res) => {
    const { id: postId } = req.params
    const post = await Post.findOne({ _id: postId })
    if (!post) {
        throw new CustomError.NotFoundError(`no post with id: ${postId}`)
    }

    res.status(StatusCodes.OK).json({ post })

}

const updatePost = async (req, res) => {
    const updates = Object.keys(req.body)
    const validUpdates = ['title', 'decription', 'category', 'image']
    const isValidUpdates = updates.every((update) => validUpdates.includes(update))
    const { id: postId } = req.params


    if (!isValidUpdates) {
        throw new CustomError.BadRequestError('invalid updates')
    }

    const post = await Post.findOne({ _id: postId })
    if (!post) {
        throw new CustomError.NotFoundError(`no post with id: ${postId}`)
    }

    updates.forEach((update) => post[update] = req.body[update])
    await post.save()
    res.status(StatusCodes.OK).json({ msg: 'success' })
}

const deletePost = async (req, res) => {
    const { id: postId } = req.params
    const post = await Post.findOne({ _id: postId })
    if (!post) {
        throw new CustomError.NotFoundError(`no post with id: ${postId}`)
    }
    await post.remove()

    res.status(StatusCodes.OK).json({ msg: 'post deleted' })
}

const uploadImgPost = async (req, res) => {

    if (!req.files) {
        throw new CustomError.BadRequestError('no image uploADED')
    }

    const postImage = req.files.upload;

    if (!postImage.mimetype.startsWith('image')) {
        throw new CustomError.BadRequestError('upload just an image')
    }

    const maxSize = 1024 * 1024;

    if (postImage.size > maxSize) {
        throw new CustomError.BadRequestError('image should not be more than 1MB')
    }

    res.status(StatusCodes.OK).json({ image: `/upload/${postImage.name}` })
    console.log(req.files);
}

module.exports = {
    createPost,
    getPost,
    updatePost,
    getPosts,
    deletePost,
    uploadImgPost,
    currentUserPosts
}