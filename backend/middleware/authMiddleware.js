const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secretkey");

    // نخزن userId في req
    req.user = decoded.userId;

    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
