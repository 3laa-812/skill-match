const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const { getMatchingJobs } = require("../../controllers/matching.controller");

router.get("/", auth, getMatchingJobs);

module.exports = router;
