import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    taskId: {
      type: String,
      // required: true,
    },
    taskName: {
      type: String,
    },
    priority: {
      type: String,
      // required: true,
    },
    startDate: {
      type: String,
      // required: true,
    },
    endDate: {
      type: String,
      // required: true,
    },
    passKey: {
      type: String,
      // required: true,
    },
    description: {
      type: String,
    },
    taskFiles: [
      {
        type: String,
      },
    ],
    userId: {
      type: String,
      // required: true,
    },
    typeOfUserRole: {
      type: String,
      //
      required: true,
    },
    userName: {
      type: "string",
      //  required: true
    },
    targetUserId: {
      type: "string",
      // required: true
    },
    whoCreated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    headOfOrganization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const TaskModel = mongoose.model("Task", TaskSchema);
export default TaskModel;
