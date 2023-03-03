import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    FirstName: {
      type: String,
    },
    LastName: {
      type: String,
    },
    Email: {
      type: String,
    },
    Password: {
      type: String,
    },
    ProfilePhoto: {
      type: String,
    },
    OTPReset: {
      type: String,
    },
    OTP: {
      type: String
    },
    Verified: {
      type: Boolean,
      default: false,
    },
    Token: {
      type: String,
    },
    Children: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'child'
    }]
  },

  {
    timestamps: true,
  }
);

const User = mongoose.model("user", userSchema);

export { User };
