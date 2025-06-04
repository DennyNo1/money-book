const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

// 验证 Token 的中间件
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    //JWT 库（比如 jsonwebtoken）的 jwt.verify 默认自动校验过期时间，你不用手动提取 exp 字段去对比时间。
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token expired' });
  }
}

module.exports = { verifyToken };
