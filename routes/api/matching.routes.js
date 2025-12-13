const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const { getMatchingJobs } = require("../../controllers/matching.controller");

/**
 * @swagger
 * tags:
 *   name: Matching
 *   description: Job matching based on skills
 */

/**
 * @swagger
 * /matching:
 *   get:
 *     summary: Get matching jobs for current user
 *     tags: [Matching]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matching jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 */
router.get("/", auth, getMatchingJobs);

module.exports = router;
