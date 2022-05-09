const express = require('express');
const { createUser, userLogin, getCurrentUser } = require('../controllers/user.controller');
const { loginRequired } = require('../middlewares/authentication');
const router = express.Router();

router.post("/", createUser)
router.post("/login", userLogin)
router.get("/currentUser",loginRequired, getCurrentUser)


module.exports = router;