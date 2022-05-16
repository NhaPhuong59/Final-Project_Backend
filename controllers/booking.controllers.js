const { catchAsync, sendResponse } = require("../helpers/utils");
const { AppError } = require("../helpers/utils");
const booking = require("../models/Booking");
const Camp = require("../models/Campsite");

const bookingController = {};

bookingController.createBooking = catchAsync(async (req, res, next) => {
    console.log(req.body)
  let { guest, startDate, endDate, campId} = req.body;
//   const {id} =req.params
//   console.log("campId",id)
  let camp = await Camp.findById(campId)
  camp.bookedDates.push({
      startDate,
      endDate
  })
  camp = await camp.save()

  let newBooking = await booking.create({
      campId,
      guest,
      startDate,
      endDate
  })
  return sendResponse(
    res,
    200,
    true,
    {},
    null,
    "Create booking successful"
  );
});

bookingController.getBookingByCampId = catchAsync(async(req, res)=>{
  const {campId} = req.params
  let bookingList = await booking.find({campId:campId}).sort({"startDate":1})
  console.log(bookingList)
  return sendResponse(res, 200, true,bookingList, null, "Get booking list successful")
})


module.exports = bookingController;
