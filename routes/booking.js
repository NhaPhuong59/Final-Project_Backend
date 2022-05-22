const express = require("express");
const { body, param } = require("express-validator");
const {
  createBooking,
  getBookingSuccess,
  confirmBooking,
  getAllBookingByCampId,
  getOwnTrip,
} = require("../controllers/booking.controllers");

const { loginRequired } = require("../middlewares/authentication");
const { validate, checkObjectId } = require("../middlewares/validator");
const { route } = require("./campsite.api");
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

router.get("/ownTrip", getOwnTrip)

module.exports = router;
