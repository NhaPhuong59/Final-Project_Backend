const { sendResponse, catchAsync } = require("../helpers/utils");
const Camp = require("../models/Campsite");

const campController = {};
campController.getCampList = async (req, res) => {
  let {
    startDate: queryStartDate, 
    endDate: queryEndDate,
    minPrice: queryMinPrice,
    maxPrice: queryMaxPrice,
  } = req.query
  console.log("req.query", req.query)

  let filter = []
  if (queryStartDate || queryEndDate) {
    filter.push({
      // there is no overlapping booking interval
      $not: {
        // there is an overlapping booking interval
        $elemMatch: {
          // the booking interval overlaps
          $not: {
            // the booking interval doesn't overlap
            $or: [
              // we leave before the booked interval
              { startDate: {$gte: queryEndDate || queryStartDate} },
              // we arrive after the booked interval
              { endDate: {$lte: queryStartDate || queryEndDate} },
            ]
          }
        }
      }
    })
  }
  if (queryMinPrice || queryMaxPrice) {
    let priceFilter = {}
    if (queryMinPrice) priceFilter.$gte = queryMinPrice
    if (queryMaxPrice) priceFilter.$lte = queryMaxPrice
    filter.push({price: priceFilter})
  }
  if (filter.length === 0) filter = {}
  else if (filter.length === 1) filter = filter[0]
  else filter = {$and: filter}
  console.log("filter", JSON.stringify(filter))

  try {
    const searchList = await Camp.find(filter);
    return sendResponse(res, 200, true, { searchList }, null, "get ListCampsuccessful");
  } catch (error) {
    return res.status(400).send(error);
  }
};

campController.postCamp = catchAsync(async (req, res) => {
  const { currentUserId } = req;
  console.log(currentUserId);
  let { title, address, description, images, price } = req.body;
    let camp = await Camp.create({
      author: currentUserId,
      title,
      description,
      images,
      address,
      price,
    });
    return sendResponse(res, 200, true, { camp }, null, "successful");
})

campController.getCampById = catchAsync( async (req, res) => {
  const { id } = req.params;
    let camp = await Camp.findById(id);
    return res.status(200).send({ camp: camp, messages: "success" });
})

campController.get

module.exports = campController;
