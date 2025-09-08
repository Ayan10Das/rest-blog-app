const express = require('express')
const postModel = require('../models/Post')
const { body, validationResult } = require('express-validator');
const { verifyAccessToken } = require('../middleware/authMiddleware');
const multer=require('multer')
const path=require('path')

const storage=multer.diskStorage({
    filename:function(req,cb,file){
        const ext=path.extname(file.originalname)
        const name=path.basename(file.originalname,ext)

        cb(null,name+"-"+Date.now()+ext)
    },
    destination:function(req,cb,file){
        cb(null,'/uploads')
    }
})

const upload=multer({storage:storage})


const router = express.Router();


router.post('/', verifyAccessToken,
    [
        body('title').isLength({ min: 4, max: 100 }).withMessage("Title must be betweeen 4 to 100 characters"),
        body('summary').isLength({ min: 10, max: 300 }).withMessage("Summary must be between 20 to 300 characters"),
        body('content').isLength({ min: 20 }).withMessage("Content is too short"),
    ],
    upload.single('file')
    ,async (req, res) => {
        const validationErrors = validationResult(req)

        if (!validationErrors.isEmpty()) {
            return res.status(400).json({
                errors: validationErrors.array(),
                message: "Invalid content feild"
            })
        }

        try {
            const { title, summary, content } = req.body;

            const post = await postModel.create({
                title,
                summary,
                content,
                author:req.user.id
            })

            return res.status(201).json({
                post:post,
                message:"Post is created sucessfully"
            })
        }
        catch (err) {
            return res.status(500).json({
                error: err,
                message: "Server error please try again later!"
            })
        }
    })

router.get('/',async (req,res)=>{
    try{
        const posts=await postModel.find()
        .populate('author','username email -_id')
        .sort({ createdAt: -1 })
        
        res.json({ posts })
    }
    catch(err){
        res.json({error:err,message:"Server error!"})
    }
})

module.exports = router