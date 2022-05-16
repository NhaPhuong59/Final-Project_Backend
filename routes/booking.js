const express = require('express');
const { createBooking, getBookingByCampId } = require('../controllers/booking.controllers');

const { loginRequired } = require('../middlewares/authentication');
const router = express.Router();

router.post("/:id", createBooking)
router.get("/campId/:campId", getBookingByCampId)

module.exports = router;