const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

function generateToken(payload, type) {
  try {
    if (!payload || !type || !secretKey) {
      throw new Error("Payload, type, secretKey are required");
    }
    let token;

    // 15m过期时间太少了，所以改成1h
    if (type === 'accessToken') {
      token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    } else if (type === 'refreshToken') {
      token = jwt.sign(payload, secretKey, { expiresIn: "30d" });
    } else {
      throw new Error("Invalid token type");
    }

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw error;
  }
}

module.exports = { generateToken };
