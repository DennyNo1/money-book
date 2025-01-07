const { register, login } = require("../controller/userController");
const express = require("express");
const router = express.Router();
//这两个不需要jwt
router.post("/user/register", register);
router.post("/user/login", login);
module.exports = router;
