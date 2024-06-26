import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },

    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    trainerId: { type: String },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    key: { type: String },
    course: [],
    courses: [
      {
        batchId: {
          type: String,
        },
        courseName: {
          type: String,
        },
        purpose: {
          type: String,
        },
        description: {
          type: String,
        },
        instructorId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
