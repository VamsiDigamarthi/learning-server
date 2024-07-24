import mongoose from "mongoose";
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  answers: {
    type: [String],
    // required: true,
  },
  questionType: {
    type: String,
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
    },
    trainerName: { type: String },
    designation: { type: String },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    feedBackQuestions: {
      type: [QuestionSchema],
      required: true,
    },
    headOfOrganization: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const PostfeedbackModel = mongoose.model("Postfeedback", PostfeedbackSchema);
export default PostfeedbackModel;
