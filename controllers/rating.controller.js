const { catchAsync, sendResponse } = require("../helpers/utils");
const Booking = require("../models/Booking");
const Camp = require("../models/Campsite");
const Rating = require("../models/Rating");

const ratingController = {}

ratingController.createRating = catchAsync(async (req, res, next) => {
    let { user, camp, rating, startDate} = req.body;
    console.log("camp", camp)
    console.log("rating", rating)

    if(rating === null){
        throw new AppError(
            400,
            "Ratin is invalid",
            "Rating Error"
          );
    }

    await Rating.create({
        user,
        camp,
        startDate,
        rating
    })
    const query = {campId:camp,startDate: startDate}
     await Booking.findOneAndUpdate(query, {rating: rating})
    // console.log("bookingRated", bookingRated)
    // bookingRated.rating = rating
    // bookingRated = await bookingRated.save()
    let campRated = await Camp.findById(camp)
    let averageRating = 0
    if (campRated.rating){
     averageRating = (campRated.rating+rating)/2
    }else {
     averageRating = rating
    }
    campRated.rating = averageRating;

    campRated = await campRated.save()




    return sendResponse(res,200,true,{}, null,"Success")

})

ratingController.getListRating = catchAsync(async (req, res, next)=>{
    const {userId} = req.params
    const listRating = await Rating.find({"user":`${userId}`})
    return sendResponse(res,200,true,listRating, null,"Success")
})

module.exports = ratingController;
// module.exports = ratingController;