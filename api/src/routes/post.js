const express = require('express')
const postModel = require('../models/Post')
const { body, validationResult } = require('express-validator');
const { verifyAccessToken } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/multerMiddleware')

const router = express.Router();


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

module.exports = router