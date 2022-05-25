const express = require("express");
const { createRating, getListRating } = require("../controllers/rating.controller");

const router = express.Router();

router.post("/", createRating)
router.get("/:userId", getListRating)

module.exports = router;

