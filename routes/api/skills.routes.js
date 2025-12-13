const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const Skill = require("../../models/Skill.model");

/**
 * @swagger
 * tags:
 *   name: Skills
 *   description: Skill management
 */

// POST /api/skills  (Add Skill)
/**
 * @swagger
 * /skills:
 *   post:
 *     summary: Add a new skill
 *     tags: [Skills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Skill created
 *       400:
 *         description: Skill already exists
 */
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const skill = new Skill({ name });
    await skill.save();

    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ msg: "Skill already exists" });
  }
});

// GET /api/skills  (Get all skills)
/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get all skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Skill'
 */
router.get("/", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

module.exports = router;
