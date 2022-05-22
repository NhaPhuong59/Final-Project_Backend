const express = require('express');
const router = express.Router();

/* GET home page. */
router.get("/",(req, res, next) => {
    return res.status(200).send({data:{key: "value"}, message:"success"});
});
const campsiteRoutes = require("./campsite.api.js");
router.use("/camps", campsiteRoutes);
const userRoutes = require("./users.js");
router.use("/users", userRoutes);
const bookingRoutes = require("./booking.js");
router.use("/booking", bookingRoutes);
const imageRoutes = require("./images.js");
router.use("/image", imageRoutes);

module.exports = router;