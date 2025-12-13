const User = require("../models/User.model");
const Job = require("../models/Job.model");

exports.getMatchingJobs = async (req, res) => {
  try {
    // 1. user id من التوكن
    const userId = req.user;

    // 2. هات المستخدم ومهاراته (populate عشان تجيب الأسماء)
    const user = await User.findById(userId).populate("skills");

    if (!user || !user.skills || user.skills.length === 0) {
      return res.json({
        count: 0,
        jobs: [],
        msg: "User has no skills"
      });
    }

    // استخراج أسماء المهارات من مصفوفة الـ objects
    const userSkillNames = user.skills.map(skill => skill.name);

    console.log("User Skills:", userSkillNames); // للتأكد في الكونسول

    // 3. هات الوظايف اللي فيها أي skill مشترك (مقارنة Strings بـ Strings)
    const jobs = await Job.find({
      skills: { $in: userSkillNames }
    });

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
