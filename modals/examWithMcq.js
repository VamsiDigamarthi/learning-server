import mongoose from "mongoose";
const { Schema } = mongoose;

const ExamWithMcqSchema = new Schema(
  {
    examId: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    description: { type: String },

    mcqs: [],
    description: {
      type: String,
    },

    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ExamWithMcqModel = mongoose.model("ExamWithMcq", ExamWithMcqSchema);
export default ExamWithMcqModel;
