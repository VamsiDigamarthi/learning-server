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
const OrganizationFeedbackSchema = new Schema(
  {
    feedBackQuestions: {
      type: [QuestionSchema],
      required: true,
    },
  },
  { timestamps: true }
);

const OrganizationFeedbackModel = mongoose.model(
  "OrganizationFeedback",
  OrganizationFeedbackSchema
);
export default OrganizationFeedbackModel;
