import mongoose from "mongoose";
const { Schema } = mongoose;

const Educate = new Schema({
  level: {
    type: String,
  },
  institution: { type: String },
  branch: { type: String },
  marksPercentage: { type: String },
  passoutYear: { type: String },
});

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

    // profile section
    image: {
      type: String,
    },
    joiningDate: {
      type: String,
    },
    mobile: { type: String },
    bio: { type: String },
    education: [],
    resume: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    branchName: { type: String },
    accountName: { type: String },
    upiId: { type: String },
    designation: { type: String },
    studentId: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);
export default UserModel;
