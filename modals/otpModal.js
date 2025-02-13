import mongoose from "mongoose";
const { Schema } = mongoose;

const OtpSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const OtpModel = mongoose.model("Otp", OtpSchema);
export default OtpModel;
