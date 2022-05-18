const express = require('express');
const { createBooking, getBookingSuccess, confirmBooking, getAllBookingByCampId } = require('../controllers/booking.controllers');

const { loginRequired } = require('../middlewares/authentication');
const router = express.Router();

router.post("/:id", createBooking)
router.get("/bookingSuccess/:campId", getBookingSuccess)
router.put("/confirm/:token", confirmBooking)
router.get("/allBooking/:campId", getAllBookingByCampId)

module.exports = router;