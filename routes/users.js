const express = require("express");
const { body, header, param } = require("express-validator");
const {
  createUser,
  userLogin,
  getCurrentUser,
  putForgotPassword,
  resetPassword,
} = require("../controllers/user.controller");
const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/",
  validate([
    body("userName", "Invalid name").exists().notEmpty(),
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  createUser
);

router.post(
  "/login",
  validate([
    body("email", "Invalid email").exists().isEmail(),
    body("password", "Invalid password").exists().notEmpty(),
  ]),
  userLogin
);

router.get(
  "/currentUser",
  validate([header("authorization").exists().isString()]),
  loginRequired,
  getCurrentUser
);
router.post("/reset", 
validate([
    body("email", "Invalid email").exists().isEmail(),
  ]),
putForgotPassword);
router.put("/reset/:token", 
validate([param("token").exists().isString(),
body("newPassword").exists().notEmpty()
]
),
resetPassword);

module.exports = router;
