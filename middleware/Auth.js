const config = require("config");
const JWT = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  // check for token

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No token, authorization denied",
    });
  }
  try {
    // verify toekn
    const decoded = JWT.verify(token, config.get("jwtsecret"));
    // add user payload
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({
      status: "error",
      message: "Token is not valid",
    });
  }
};

module.exports = auth;
