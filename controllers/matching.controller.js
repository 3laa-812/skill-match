const User = require("../models/User.model");
const Job = require("../models/Job.model");

exports.getMatchingJobs = async (req, res) => {
  try {
    // 1. user id من التوكن
    const userId = req.user;

    // 2. هات المستخدم
    const user = await User.findById(userId);

    if (!user || !user.skills || user.skills.length === 0) {
      return res.json({
        count: 0,
        jobs: [],
        msg: "User has no skills"
      });
    }

    // 3. هات الوظايف اللي فيها أي skill مشترك
    const jobs = await Job.find({
      skills: { $in: user.skills }
    }).populate("skills");

    // 4. رجّع النتيجة
    res.json({
      count: jobs.length,
      jobs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};
