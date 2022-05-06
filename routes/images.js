const express = require('express');
const multer  = require('multer')
const { createImage, getImage } = require('../controllers/images.controllers');
const router = express.Router();
const upload = multer()

router.post("/", upload.array('image'), createImage)
router.get("/:hash", getImage)

module.exports = router;