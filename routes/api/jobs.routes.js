const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const Job = require("../../models/Job.model");

// POST /api/jobs  (Create Job)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, skills } = req.body;

    const job = new Job({
      title,
      description,
      skills,
      createdBy: req.user
    });

    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/jobs  (Get all jobs)
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
