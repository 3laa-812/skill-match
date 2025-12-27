const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const Skill = require("../../models/Skill.model");

// POST /api/skills  (Add Skill)
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
router.get("/", async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
});

module.exports = router;
