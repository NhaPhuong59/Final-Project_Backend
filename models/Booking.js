const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
const Schema = mongoose.Schema;


const bookingSchema = Schema(
    {
        campId: { type: Schema.Types.ObjectId, ref: "Camp", required: true },
        guest: { guestName: {type: String, required:true}, email: {type: String, required:true}},
        startDate: {type: String, required:true},
        endDate: {type: String, required:true}
    },
    {
        timestamps: true,
    }
)

bookingSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
}

const booking = mongoose.model("Booking", bookingSchema);
module.exports =booking;