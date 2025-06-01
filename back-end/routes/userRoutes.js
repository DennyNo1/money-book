const {
  register,
  login,
  refreshToken,
  checkUsername,
} = require("../controller/userController");
const express = require("express");
const router = express.Router();
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/refreshToken", refreshToken);
router.get("/user/checkUsername", checkUsername);
module.exports = router;
