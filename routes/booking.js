const express = require("express");
const { body, param } = require("express-validator");
const {
  createBooking,
  getBookingSuccess,
  confirmBooking,
  getAllBookingByCampId,
} = require("../controllers/booking.controllers");

const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const router = express.Router();

router.post(
  "/:id",
  createBooking
);

router.get("/bookingSuccess/:campId", loginRequired, getBookingSuccess);

router.put(
  "/confirm/:token",
  validate([param("token").exists().isString()]),
  confirmBooking
);

router.get("/allBooking/:campId", getAllBookingByCampId);

module.exports = router;
