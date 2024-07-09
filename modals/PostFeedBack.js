import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: [String],
    required: true,
  },
});

const PostfeedbackSchema = new Schema(
  {
    date: {
      type: Date,
      default: new Date(),
    },
    courseName: {
      type: String,
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    feedBackQuestions: {
      type: [QuestionSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const PostfeedbackModel = mongoose.model("Postfeedback", PostfeedbackSchema);
export default PostfeedbackModel;
