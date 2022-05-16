const express = require('express');
const { getCampList, postCamp, getCampById, getCampListByAuthorId, updateCamp } = require('../controllers/campsite.controllers');
const { loginRequired } = require('../middlewares/authentication');
const router = express.Router();

// router.get("/", getCampList)
router.post("/",loginRequired ,postCamp)
router.get("/camp/:id", getCampById)
router.get("/", getCampList)
router.get("/author/:authorId", getCampListByAuthorId)
router.put("/",updateCamp)


module.exports = router;