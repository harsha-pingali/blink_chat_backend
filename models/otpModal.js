import mongoose from "mongoose";
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model("otp", otpSchema);
export default Otp;
