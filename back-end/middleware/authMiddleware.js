const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;

// 验证 Token 的中间件
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded; // 将解码后的用户信息附加到请求对象中
    next();
  });
}

module.exports = { verifyToken };
