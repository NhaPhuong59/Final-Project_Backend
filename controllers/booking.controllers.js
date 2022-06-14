const { catchAsync, sendResponse} = require("../helpers/utils");
const { AppError } = require("../helpers/utils");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Camp = require("../models/Campsite");
const moment = require('moment');
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const bookingController = {};

bookingController.createBooking = catchAsync(async (req, res, next) => {
  let { guest, startDate, endDate, campId, guestNumber, totalPrice} = req.body;

  const token = await crypto.randomBytes(20).toString("hex");

  const newBooking = await Booking.create({
      campId,
      guest,
      guestNumber,
      totalPrice,
      startDate,
      endDate,
      confirmToken: token
  })
  

  const camp = await Camp.findById(campId)

    let msg = {
      from: '"Nok Nok Campsite Admin" <campsite2022@gmail.com>',
      to: `${guest.email}`,
      subject: "CampSite - Verify email",
      text:
      `
      Hi ${guest.guestName},

      Thanks for booking our camp!

      You have booked a trip to ${camp.title} from ${moment(startDate).format("MMM Do YY")} to ${moment(endDate).format("MMM Do YY")} for ${guestNumber} peoples.

      We need a little more information to complete your booking, including a confirmation of your email address.

      Click below to confirm your email address:

      ${req.headers.origin}/confirmBooking/${token}

      If you have problems, please paste the above URL into your web browser.

      If you did not request this, please ignore this email`,
    };
    sgMail.send(msg).then(respose=> console.log("email sent..."))
    .catch(error=> console.log(error.message))
  const success = `An email has been sent to ${guest.email} with further instruction. If you do not see our email, please check the spam!`;

  return sendResponse(
    res,
    200,
    success,
    {},
    null,
    "Create booking successful"
  );
});


bookingController.confirmBooking = catchAsync(async(req, res)=>{
  const {token} = req.params;
  let bookingConfirmed = await Booking.findOne(
    {
      confirmToken: token,
      confirmExpires: {$gt: Date.now()}
    }
  )
  if (!bookingConfirmed) {
    throw new AppError(
      400,
      "Your confirm has expired!",
      "Confirm Booking Error"
    );
  }
  const {campId, startDate, endDate, totalPrice, guestNumber, guest} = bookingConfirmed

  bookingConfirmed.status = "confirmed"
  
  
  let camp = await Camp.findById(campId)
  camp.bookedDates.push({
    startDate: bookingConfirmed.startDate,
    endDate: bookingConfirmed.endDate
  })
  camp = await camp.save()
  const {email, guestName} = guest

    
    let msg = {
      from: '"Nok Nok Campsite Admin" <campsite2022@gmail.com>',
      to: `${email}`,
      subject: "CampSite - Booking Confirmation",
      text: `Hello ${guestName}!, 
      Congratulations on your successful booking! 
      Details of your trip below:
      Full Name of guest: ${guestName}
      Place : ${camp.title}
      Number of guest: ${guestNumber} peoples
      Dates: ${moment(startDate).format("MMM Do YY")} - ${moment(endDate).format("MMM Do YY")}
      Total pay: $${totalPrice}

      This email is to confiem that your booking has just been successfuly. If you did not make this booking, please hit reply and notify us at once`
      ,
    };
    sgMail.send(msg).then(respose=> console.log("email sent..."))
    .catch(error=> console.log(error.message))
  
  
  bookingConfirmed = bookingConfirmed.save()
  return sendResponse(res, 200, true, {}, null, "Confirm booking successful")


})

bookingController.getBookingSuccess = catchAsync(async(req, res)=>{
  const {campId} = req.params
  let bookingList = await Booking.find({campId:campId, status: "confirmed"}).sort({"startDate":1})
  return sendResponse(res, 200, true,bookingList, null, "Get booking list successful")
})

bookingController.getAllBookingByCampId = catchAsync(async(req, res)=>{
  const {campId} = req.params
  let bookingList = await Booking.find({campId:campId})
  let bookedDatesList = []
  bookingList.forEach(({startDate, endDate})=>{
    bookedDatesList.push({startDate:startDate, endDate: endDate})
  })
  return sendResponse(res, 200, true,bookedDatesList, null, "Get booking list successful")
})

bookingController.getOwnTrip = catchAsync(async(req, res)=>{
  const {email} = req.query
  let bookingList = await Booking.find({"guest.email":`${email}`}).populate("campId").sort({"startDate":-1})
  
  return sendResponse(res, 200, true, bookingList, null, "Succesful")
})

module.exports = bookingController;
