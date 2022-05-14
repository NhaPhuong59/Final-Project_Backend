const express = require('express');
const { getCampList, postCamp, getCampById } = require('../controllers/campsite.controllers');
const { loginRequired } = require('../middlewares/authentication');
const router = express.Router();

// router.get("/", getCampList)
router.post("/",loginRequired ,postCamp)
router.get("/camp/:id", getCampById)
router.get("/", getCampList)


module.exports = router;