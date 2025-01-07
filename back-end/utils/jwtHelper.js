const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

function generateToken(payload) {
  console.log("Payload:", payload);
  console.log("Secret Key:", secretKey);
  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: "30d" });
    console.log("Generated Token:", token);
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
}

module.exports = { generateToken };
