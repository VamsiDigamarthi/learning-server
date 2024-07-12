import mongoose from "mongoose";
const { Schema } = mongoose;

const FeedbackSchema = new Schema(
  {
    courseName: {
      type: String,
    },
    // rating: {
    //   type: Number,
    //   required: true,
    // },
    date: {
      type: Date,
      default: new Date(),
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    creater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    feedbackform: [],
    trainerName: { type: String },
  },
  { timestamps: true }
);

const FeedbackModel = mongoose.model("Feedback", FeedbackSchema);
export default FeedbackModel;
