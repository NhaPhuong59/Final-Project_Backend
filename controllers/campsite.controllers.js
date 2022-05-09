const { sendResponse } = require("../helpers/utils");
const Camp = require("../models/Campsite");

const campController = {};
campController.getCampList = async (req, res) => {
  try {
    const camplist = await Camp.find();
    return res.status(200).send({ camplist: camplist, messages: "success" });
  } catch (error) {
    return res.status(400).send(error);
  }
};

campController.postCamp = async (req, res) => {
  const { currentUserId } = req;
  console.log(currentUserId);
  let { title, address, description, images, price } = req.body;
  try {
    let camp = await Camp.create({
      author: currentUserId,
      title,
      description,
      images,
      address,
      price,
    });
    return sendResponse(res, 200, true, { camp }, null, "successful");
  } catch (e) {
    return res.status(400).send(e);
  }
};

campController.getCampById = async (req, res) => {
  const { id } = req.params;
  try {
    let camp = await Camp.findById(id);
    return res.status(200).send({ camp: camp, messages: "success" });
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = campController;
