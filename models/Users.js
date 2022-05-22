const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
// const { required } = require("nodemon/lib/config");
const Schema = mongoose.Schema;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "partner"], default: "user" },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  return obj;
};

userSchema.methods.generateToken = function () {
  const accessToken = jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
