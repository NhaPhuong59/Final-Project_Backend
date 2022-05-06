const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const Schema = mongoose.Schema;


const imageSchema = Schema(
    {
        hash: { type: String, required: true, unique : true},
        mimetype: { type: String, required: true},
        data: { type: Buffer, required: true},
    },
    {
        timestamps: true,
    }
)

const Image = mongoose.model("Image", imageSchema);
module.exports = Image;