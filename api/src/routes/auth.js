const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/User')
const { body, validationResult } = require('express-validator')

const router = express.Router();

router.post('/register',
    [
        body('username').isLength({ min: 3 }).withMessage("Username is too short"),
        body('email').isEmail().withMessage("Email is invalid"),
        body('password').isLength({ min: 8 }).withMessage("Password is too short")
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {
            const { username, email, password } = req.body

            const existingUser = await userModel.findOne({
                $or: [{ email }, { username }]
            })
            if (existingUser) { return res.status(400).json({ message: "Email is already registered" }) }

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt);

            const newUser = await userModel.create({
                username,
                email,
                password: hashPassword
            })

            res.status(201).json({ message: "User registered sucessfully", userId: newUser._id })

        } catch (err) {
            res.status(400).json({
                message: "Server error please try again later"
            })
        }
    })

router.post('/login',
    [
        body('email').isEmail().withMessage("Email is invalid"),
        body('password').isLength({ min: 8 }).withMessage("Password is too short")
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        try {

            const { email, password } = req.body;

            const user =await userModel.findOne({ email: email })
            if (!user) { return res.status(400).json({ message: "Invalid credentials" }) }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) { return res.status(400).json({ message: "Invalid credentials" }) }

            // User is logged in sucessfully
            const accessToken = jwt.sign(
                { username: user.username, email: user.email, id: user._id },
                process.env.ACCESS_TOKEN_PRIVATE_KEY,
                { expiresIn: "1h" }  // 1 hour
            )

            const refreshToken = jwt.sign(
                { username: user.username, email: user.email, id: user._id },
                process.env.REFRESH_TOKEN_PRIVATE_KEY,
                { expiresIn: "7d" } // 7 days
            )

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000
            })

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.json({ message: "Login successful" });

        } catch (err) {
            res.status(400).json({ message: "Server error, Please try again later!" })
        }
    })


router.post("/refresh-token", (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) { return res.status(400).json({ message: "Refresh token not valid" }) }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            async (err, decoded) => {
                if (err) { return res.status(401).json({ message: "Invalid Rfresh Token" }) }

                const user =await userModel.findById(decoded._id)
                if (!user) { return res.status(400).json({ message: "User not found" }) }

                const newAccessToken = jwt.sign(
                    { id: user._id, username: user.username ,email:user.email},
                    process.env.ACCESS_TOKEN_PRIVATE_KEY,
                    { expiresIn: "1h" }
                );

                res.cookie("accessToken", newAccessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000, // 1h
                });

                res.json({ message: "Access token refreshed" });
            }
        )
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})


router.post("/logout", (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
});

module.exports = router