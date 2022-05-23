const crypto = require("crypto");

const Image = require("../models/Image");

const imagesController = {};
imagesController.createImage = async (req, res) => {
  const images = [];
  for (let file of req.files) {
    const mimetype = file.mimetype;
    const data = file.buffer;
    const hash = crypto.createHash("md5").update(data).digest("hex");
    const imageCreated = await Image.findOne({ hash: hash });
    if (!imageCreated) {
      const image = new Image({
        hash,
        mimetype,
        data,
      });
      image.save();
    }
    images.push("/api/image/" + hash);
  }
  return res.status(200).send({ images, messages: "success" });
};
imagesController.getImage = async (req, res) => {
  try {
    const image = await Image.findOne({ hash: req.params.hash });
    res.set({
      "Content-Type": image.mimetype,
      "Content-Length": image.data.size,
    });
    res.send(image.data);
  } catch (error) {
    return res.status(400).send(error);
  }
};

module.exports = imagesController;
