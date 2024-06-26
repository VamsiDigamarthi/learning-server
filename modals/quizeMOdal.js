import mongoose from "mongoose";
const { Schema } = mongoose;

const QuizeSchema = new Schema(
  {
    quizeId: {
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
    date: {
      type: String,
    },
    mcqs: [],
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const QuizeModel = mongoose.model("Quize", QuizeSchema);
export default QuizeModel;
