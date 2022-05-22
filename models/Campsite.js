const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const Schema = mongoose.Schema;


const campSchema = Schema(
    {
        author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        title: { type: String, required: true},
        description: { type: String, required: true},
        images: { type: Array, required: true},
        address: {addressUrl:{type: String, required: true}, addressText:{type: String, required}},
        rating: {type: Number, default: 0},
        price: {type: Number, required: true},
        bookedDates: {type : Array, default: []},
    },
    {
        timestamps: true,
    }
)

campSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
}

const Camp = mongoose.model("Camp", campSchema);
module.exports =Camp;