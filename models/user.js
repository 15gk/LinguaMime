const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.plugin(passportLocalMongoose);

const UserModel = mongoose.model("user", UserSchema);
module.exports = UserModel;
