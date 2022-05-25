const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const Schema = mongoose.Schema;


const ratingSchema = Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        camp: { type: Schema.Types.ObjectId, ref: "Camp", required: true },
        startDate: {type: String, required: true},
        rating: {type: Number, required: true}
    },
    {
        timestamps: true,
    }
)

ratingSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
}

const Rating = mongoose.model("Rating", ratingSchema);
module.exports =Rating;