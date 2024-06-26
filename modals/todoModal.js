import mongoose from "mongoose";
const { Schema } = mongoose;

const TodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    time: {
      type: String,
      required: true,
    },
    mark: {
      type: Boolean,
      default: false,
    },
    date: {
      type: String,
      required: true,
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const TodoModel = mongoose.model("Todo", TodoSchema);
export default TodoModel;
