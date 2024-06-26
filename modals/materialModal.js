import mongoose from "mongoose";
const { Schema } = mongoose;

const MaterialSchema = new Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    passkey: {
      type: String,
      required: true,
    },
    selectType: {
      type: String,
    },

    availableOn: {
      type: String,
    },
    description: {
      type: String,
    },
    pdf: {
      type: String,
    },
    Author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const MaterialModel = mongoose.model("Material", MaterialSchema);
export default MaterialModel;
