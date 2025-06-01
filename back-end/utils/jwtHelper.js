const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

function generateToken(payload, type) {

  try {
    if (!payload || !type || !secretKey) {
      throw new Error("Payload, type, secretKey are required");
    }
    let token;
    //这返回的完整的jwt，即包含header,payload,signature
    if (type = 'accessToke') {
      token = jwt.sign(payload, secretKey, { expiresIn: "15m" });
    }
    if (type = 'refreshToke') {
      token = jwt.sign(payload, secretKey, { expiresIn: "30d" });
    }

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
}

module.exports = { generateToken };
