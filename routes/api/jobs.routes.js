const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const Job = require("../../models/Job.model");

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job management
 */

// POST /api/jobs  (Create Job)
/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of skill names
 *     responses:
 *       201:
 *         description: Job created successfully
 *       500:
 *         description: Server error
 */
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
/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: List of jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Job'
 */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
