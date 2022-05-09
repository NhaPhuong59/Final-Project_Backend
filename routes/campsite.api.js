const express = require('express');
const { getCampList, postCamp, getCampById } = require('../controllers/campsite.controllers');
const { loginRequired } = require('../middlewares/authentication');
const router = express.Router();

router.get("/", getCampList)
router.post("/",loginRequired ,postCamp)
router.get("/:id", getCampById)

module.exports = router;