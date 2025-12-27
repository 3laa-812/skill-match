const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const User = require("../../models/User.model");

// ==============================
// GET /api/users/me
// ==============================
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// ==============================
// PUT /api/users/skills
// ==============================
router.put("/skills", auth, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ msg: "Skills must be an array" });
    }

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.skills = skills;
    await user.save();

    // ✅ IMPORTANT: return updated user
    const updatedUser = await User.findById(req.user)
      .populate("skills", "name")
      .select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
