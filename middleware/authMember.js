const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // Get token from header
  const membertoken = req.header("x-member-auth-token");

  // Check if token exist
  if (!membertoken) {
    res.status(401).json({ msg: "Token not found, authorization denied..!" });
  }

  try {
    const decoded = jwt.verify(membertoken, config.get("jwtSecret"));

    req.member = decoded.member;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
