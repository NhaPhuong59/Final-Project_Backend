const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bookingSchema = Schema(
    {
        campId: { type: Schema.Types.ObjectId, ref: "Camp", required: true },
        guest: { guestName: {type: String, required:true}, email: {type: String, required:true}},
        guestNumber: {type: Number, required: true},
        totalPrice: {type: Number, required: true},
        startDate: {type: String, required:true},
        endDate: {type: String, required:true},
        status: {type: String, enum: ["confirmed", "pending"], default: "pending"},
        confirmToken: {type: String},
        confirmExprires: {type: Date, default: () => new Date(new Date() + 1 * 60 * 1000) }
    },
    {
        timestamps: true,
    }
)

bookingSchema.methods.toJSON = function () {
    const obj = this._doc;
    return obj;
}

bookingSchema.index(
    { createdAt: 1 },
  {
    expireAfterSeconds: 45,
    partialFilterExpression: { status: "pending" }
  }
)

const Booking = mongoose.model("Booking", bookingSchema);
module.exports =Booking;