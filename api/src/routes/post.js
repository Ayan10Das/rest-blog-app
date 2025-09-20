const express = require('express')
const postModel = require('../models/Post')
const { body, validationResult } = require('express-validator');
const { verifyAccessToken } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multerMiddleware')
const commentModel = require('../models/Comments')

const router = express.Router();

router.get('/single-post/:postId/comments', async (req, res) => {
    const { postId } = req.params

    const limit = Math.max(1, parseInt(req.query.limit || '5'))
    const page = Math.max(1, parseInt(req.query.page || '1'))
    const skip = (page - 1) * limit

    try {
        const postExists = await postModel.findById(postId).select('_id');
        if (!postExists) return res.status(404).json({ message: 'Post not found' });

        const comments = await commentModel.find({ post: postId })
            .populate('author', "username email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await commentModel.countDocuments({ post: postId });

        res.status(200).json({
            comments,
            limit,
            skip,
            hasMore: skip + comments.length < total
        })
    } catch(err){
        console.error(err)
        res.status(500).json({ message: "Server Error" })
    }
})

router.post('/single-post/:postId/comments',
    verifyAccessToken,
    body('content').isLength({ min: 1 }).withMessage("Content can not be empty"),
    async (req, res) => {
        const { postId } = req.params
        const validationErrors = validationResult(req);

        if (!validationErrors.isEmpty()) {
            return res.status(400).json({
                errors: validationErrors.array()
            })
        }

        try {
            const post = await postModel.findById(postId);
            if (!post) {
                return res.status(404).json({ message: "post not found!" })
            }

            const comment = await commentModel.create({
                content: req.body.content,
                post: postId,
                author: req.user.id
            })

            await comment.populate('author', 'username email')
            res.status(200).json({
                comment: comment
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({ message: "Server error please try again later!" })
        }

    })


router.post('/post', verifyAccessToken,
    upload.single('file'),
    [
        body('title').isLength({ min: 4, max: 100 }).withMessage("Title must be betweeen 4 to 100 characters"),
        body('summary').isLength({ min: 15, max: 300 }).withMessage("Summary must be between 15 to 300 characters"),
        body('content').isLength({ min: 20 }).withMessage("Content is too short"),
    ]
    , async (req, res) => {
        const validationErrors = validationResult(req)

        if (!validationErrors.isEmpty()) {
            return res.status(400).json({
                errors: validationErrors.array()
            })
        }

        try {
            const { title, summary, content } = req.body;

            const post = await postModel.create({
                title,
                summary,
                content,
                author: req.user.id,
                coverImage: req.file ? `/uploads/${req.file.filename}` : null
            })

            return res.status(201).json({
                post: post,
                message: "Post is created sucessfully"
            })
        }
        catch (err) {
            return res.status(500).json({
                message: "Server error please try again later!"
            })
        }
    })

router.get('/post', async (req, res) => {
    try {
        const posts = await postModel.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 })

        res.json({ posts })
    }
    catch (err) {
        res.json({ error: err, message: "Server error!" })
    }
})

router.get('/single-post/:postId', async (req, res) => {
    const { postId } = req.params

    try {
        const post = await postModel.findById(postId).populate('author', 'username email')

        if (!post) { return res.status(404).json({ message: "Post not found" }) }

        res.status(200).json(post)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error please try later!" })
    }
})

router.delete("/single-post/:postId", verifyAccessToken, async (req, res) => {
    const { postId } = req.params
    try {
        const post = await postModel.findById(postId)
        // console.log(post)
        if (!post) {
            return res.status(404).json({ message: "Post not found!" })
        }

        if (post.author?._id.toString() !== req.user.id) {
            // alert(req.user.id,post.author?._id)

            res.status(403).json({ message: "Unauthorized" })
            return
        }

        await post.deleteOne();

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error please try later!" });
    }
})

router.put('/single-post/:postId', verifyAccessToken, upload.single('file'),
    [
        body('title').isLength({ min: 4, max: 100 }).withMessage("Title must be between 4-100 characters"),
        body('summary').isLength({ min: 15, max: 300 }).withMessage("Summary must be between 15 to 300 characters"),
        body('content').isLength({ min: 20 }).withMessage("Content is too short"),
    ],
    async (req, res) => {
        const { postId } = req.params

        const validationErrors = validationResult(req)
        if (!validationErrors.isEmpty()) {
            return res.status(401).json({
                errors: validationErrors.array()
            })
        }

        try {
            const post = await postModel.findById(postId)
            if (!post) {
                return res.status(404).json({ message: "Post not found!" })
            }

            if (post.author?._id.toString() !== req.user.id) {
                res.status(403).json({ message: "Unauthorized" })
                return
            }

            const { title, summary, content } = req.body;

            post.title = title;
            post.summary = summary
            post.content = content

            if (req.file) {
                post.coverImage = `/uploads/${req.file?.filename}`
            }

            await post.save()

            res.status(200).json({
                message: "Post updated successfully",
                post,
            });

        }
        catch (err) { }
    }
)

module.exports = router