const RegexEscape = require("regex-escape");
const { sendResponse, catchAsync } = require("../helpers/utils");
const Camp = require("../models/Campsite");

const campController = {};
campController.getCampList = async (req, res) => {
  console.log('req.query', req.query);
  let {page, limit,
    startDate: queryStartDate, 
    endDate: queryEndDate,
    minPrice: queryMinPrice,
    maxPrice: queryMaxPrice,
    camp: queryCamp,
  } = req.query
  console.log("req.query", req.query)
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 9;
  const offset = limit * (page - 1);

  let filter = []
  if (queryCamp){
    filter.push({
      title: {$regex: '.*' + RegexEscape(queryCamp) + '.*', $options: 'i'}
      // title: queryCamp,
    });
  }
  if (queryStartDate || queryEndDate) {
    filter.push({
      bookedDates: {
        // there is no overlapping booking interval
        $not: {
          // there is an overlapping booking interval
          $elemMatch: {
            // the booking interval overlaps
            $nor: [
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

  const count = await Camp.countDocuments(filter)
  const totalPage = Math.ceil(count/ limit);
  let searchList = await Camp.find(filter).skip(offset).limit(limit).sort({"createdAt":-1})
  searchList.map((i) => console.log(i));
  return sendResponse(res, 200, true, { searchList, totalPage}, null, "get ListCampsuccessful");
};

campController.createCamp = catchAsync(async (req, res) => {
  const { currentUserId } = req;
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

campController.getCampListByAuthorId = catchAsync(async(req, res)=>{
  const {authorId} = req.params
   let campList = await Camp.find({author: authorId})
   return sendResponse(res, 200, true,  campList , null, "successful");
})

campController.updateCamp = catchAsync( async(req, res)=>{
  const { title, address, description, images, price } = req.body.dataUpdate;
  const {id}= req.body
  let camp = await Camp.findByIdAndUpdate(id, {
    title: title,
    address:
    {addressText: address.addressText, 
    addressUrl : address.addressUrl},
    description: description,
    images: images,
    price: price
  })
  camp = await camp.save()
  return sendResponse(res, 200, true, {}, null, "Update successful")
})
module.exports = campController;
