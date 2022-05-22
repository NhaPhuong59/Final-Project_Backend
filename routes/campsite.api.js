const express = require("express");
const { body } = require("express-validator");
const {
  getCampList,
  createCamp,
  getCampById,
  getCampListByAuthorId,
  updateCamp,
} = require("../controllers/campsite.controllers");
const { loginRequired } = require("../middlewares/authentication");
const { checkObjectId, validate } = require("../middlewares/validator");
const router = express.Router();

// router.get("/", getCampList)
router.post(
  "/",
  loginRequired,
  createCamp
);
router.get("/camp/:id", getCampById);
router.get("/", getCampList);
router.get("/author/:authorId", loginRequired, getCampListByAuthorId);
router.put("/", loginRequired, updateCamp);

module.exports = router;
