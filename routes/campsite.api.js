const express = require('express');
const { getCampList, postCamp, getCampById } = require('../controllers/campsite.controllers');
const router = express.Router();

router.get("/", getCampList)
router.post("/", postCamp)
router.get("/:id", getCampById)

module.exports = router;