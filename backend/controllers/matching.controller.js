const User = require("../models/User.model");
const Job = require("../models/Job.model");

exports.getMatchingJobs = async (req, res) => {
  try {
    // 1. user id من التوكن
    const userId = req.user && req.user.id ? req.user.id : req.user;

    // 2. هات المستخدم
    const user = await User.findById(userId).populate("skills", "name");

    if (!user || !user.skills || user.skills.length === 0) {
      return res.json({
        count: 0,
        jobs: [],
        msg: "User has no skills"
      });
    }

    // حضّر قوائم معرفات وأسماء مهارات المستخدم
    const userSkillIds = user.skills.map((s) => s._id || s).filter(Boolean);
    const userSkillNames = user.skills
      .map((s) => (typeof s === "string" ? s : s.name))
      .filter((n) => typeof n === "string" && n.trim().length > 0)
      .map((n) => n.toLowerCase());

    // 3. هات الوظايف اللي فيها أي skill مشترك (تعامل مع الحالتين: skills كـ ObjectId أو كـ String)
    const jobsByIds = await Job.find({
      skills: { $in: userSkillIds }
    }).populate("skills", "name");

    const jobsByNames = await Job.find({
      skills: { $in: userSkillNames }
    });

    // دمج النتائج مع إزالة التكرارات
    const jobsMap = new Map();
    for (const j of jobsByIds) {
      jobsMap.set(String(j._id), j);
    }
    for (const j of jobsByNames) {
      jobsMap.set(String(j._id), j);
    }
    const jobs = Array.from(jobsMap.values());

    // طبعن المهارات داخل كل وظيفة وحساب نسبة المطابقة
    const normalizedJobs = jobs.map((job, idx) => {
      const rawSkills = job.skills || [];
      const jobSkills =
        rawSkills.length > 0 && typeof rawSkills[0] === "string"
          ? rawSkills.map((s, i) => ({ id: `skill-${idx}-${i}-${s}`, name: s }))
          : rawSkills.map((s) => ({
              id: s._id || s.id,
              name: s.name,
            }));

      const matchedSkills = jobSkills.filter((s) =>
        userSkillNames.includes(String(s.name || "").toLowerCase())
      );
      const matchPercentage =
        jobSkills.length > 0
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 0;

      return {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        remote: job.remote,
        description: job.description,
        skills: jobSkills,
        matchedSkills,
        matchPercentage,
      };
    });

    // 4. رجّع النتيجة
    res.json({
      count: normalizedJobs.length,
      jobs: normalizedJobs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Server error",
      error: err.message
    });
  }
};
