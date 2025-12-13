const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const User = require("../../models/User.model");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

// ==============================
// GET /api/users/me
// ==============================
/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
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
/**
 * @swagger
 * /users/skills:
 *   put:
 *     summary: Update user skills
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of Skill IDs
 *     responses:
 *       200:
 *         description: Updated user profile
 *       400:
 *         description: Invalid input
 */
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
