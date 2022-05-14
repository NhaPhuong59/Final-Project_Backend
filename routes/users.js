const express = require('express');
const { createUser, userLogin, getCurrentUser, putForgotPassword, resetPassword } = require('../controllers/user.controller');
const { loginRequired } = require('../middlewares/authentication');
const router = express.Router();

router.post("/", createUser)
router.post("/login", userLogin)
router.get("/currentUser",loginRequired, getCurrentUser)
router.post("/reset", putForgotPassword)
router.put("/reset/:token", resetPassword )

module.exports = router;