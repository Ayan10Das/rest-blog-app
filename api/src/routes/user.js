const express = require("express");
const { verifyAccessToken } = require("../middleware/authMiddleware")
const userModel = require("../models/User");

const router = express.Router();

// PROFILE (protected)
router.get("/profile", verifyAccessToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password"); 
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
