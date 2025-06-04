const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

function generateToken(payload, type) {
  try {
    if (!payload || !type || !secretKey) {
      throw new Error("Payload, type, secretKey are required");
    }
    let token;

    if (type === 'accessToken') {
      token = jwt.sign(payload, secretKey, { expiresIn: "15m" });
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
