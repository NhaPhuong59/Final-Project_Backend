const { catchAsync, sendResponse } = require("../helpers/utils");
const { AppError } = require("../helpers/utils");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Camp = require("../models/Campsite");
const nodemailer = require("nodemailer");

const bookingController = {};

bookingController.createBooking = catchAsync(async (req, res, next) => {
    console.log(req.body)
  let { guest, startDate, endDate, campId, guestNumber, totalPrice} = req.body;

  const token = await crypto.randomBytes(20).toString("hex");

  // let camp = await Camp.findById(campId)
  // camp.bookedDates.push({
  //     startDate,
  //     endDate
  // })
  // camp = await camp.save()

  const newBooking = await Booking.create({
      campId,
      guest,
      guestNumber,
      totalPrice,
      startDate,
      endDate,
      confirmToken: token
  })


  async function main() {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "campsite2022@gmail.com",
        pass: "campsite123",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let msg = {
      from: '"Nok Nok Campsite Admin" <campsite2022@gmail.com>',
      to: `${guest.email}`,
      subject: "CampSite - Verify email",
      text: `
      Hi ${guest.guestName},
      
      Thanks for booking our camp!
      
      We need a little more information to complete your booking, including a confirmation of your email address.
      
      Click below to confirm your email address:
      
      ${req.headers.origin}/confirmBooking/${token}
      
      If you have problems, please paste the above URL into your web browser.
      
      If you did not request this, please ignore this email`,
    };

    let info = await transporter.sendMail(msg);

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  main().catch(console.error);
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
  console.log("token", token)
  let bookingConfirmed = await Booking.findOne(
    {
      confirmToken: token,
      // confirmExpires: {$gt: Date.now()}
    }
  )
  if (!bookingConfirmed) {
    throw new AppError(
      400,
      "Your confirm has expired!",
      "Confirm Booking Error"
    );
  }
  const {campId} = bookingConfirmed
  console.log("bookingConfirmed",campId)

  bookingConfirmed.status = "confirmed"
  
  
  let camp = await Camp.findById(bookingConfirmed.campId)
  // console.log(camp)
  camp.bookedDates.push({
    startDate: bookingConfirmed.startDate,
    endDate: bookingConfirmed.endDate
  })
  camp = await camp.save()
  // console.log("bookingConfirmed",bookingConfirmed.guest.email)
  // console.log("bookingConfirmed",bookingConfirmed)
  const email = bookingConfirmed.guest.email
  const guestName = bookingConfirmed.guest.guestName

  async function main() {
    let testAccount = await nodemailer.createTestAccount();
    // console.log("bookingConfirmed",bookingConfirmed)
    // console.log("bookingConfirmed",bookingConfirmed.guest)

    
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "campsite2022@gmail.com",
        pass: "campsite123",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    
    let msg = {
      from: '"Nok Nok Campsite Admin" <campsite2022@gmail.com>',
      to: `${email}`,
      subject: "CampSite - Booking Confirmation",
      text: `Hello ${guestName}!, This email is to confirm that your booking has just been successfuly. If you did not make this booking, please hit reply and notify us at once.`,
    };
    
    let info = await transporter.sendMail(msg);
    
    console.log("Message sent: %s", info.messageId);
    
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  
  main().catch(console.error);
  
  bookingConfirmed = bookingConfirmed.save()
  return sendResponse(res, 200, true, {}, null, "Confirm booking successful")


})

bookingController.getBookingSuccess = catchAsync(async(req, res)=>{
  const {campId} = req.params
  let bookingList = await Booking.find({campId:campId, status: "confirmed"}).sort({"startDate":1})
  console.log(bookingList)
  return sendResponse(res, 200, true,bookingList, null, "Get booking list successful")
})

bookingController.getAllBookingByCampId = catchAsync(async(req, res)=>{
  const {campId} = req.params
  let bookingList = await Booking.find({campId:campId})
  let bookedDatesList = []
  console.log("campId", campId)
  bookingList.forEach(({startDate, endDate})=>{
    bookedDatesList.push({startDate:startDate, endDate: endDate})
  })
  console.log(bookedDatesList)
  return sendResponse(res, 200, true,bookedDatesList, null, "Get booking list successful")
})



module.exports = bookingController;
