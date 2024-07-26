import TaskModel from "../modals/taskModal.js";
import UserModel from "../modals/UserModal.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
const __dirname = dirname(fileURLToPath(import.meta.url));

export const addTask = async (req, res, next) => {
  const { email } = req;
  const {
    taskId,
    taskName,
    priority,
    startDate,
    endDate,
    passKey,
    description,
    userId,
    userName,
    targetUserId,
    teamMembers,
    typeOfUserRole,
  } = req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });
    let teamMembersArr = teamMembers.split(",");
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    let headOfId = "";
    if (user.role === "2") {
      headOfId = user.head;
    } else {
      headOfId = user._id;
    }
    // console.log(headOfId);

    // console.log(user);

    const files = req.files;

    const taskFiles = files.map((file) => file.path);

    const doc = {
      taskId,
      taskName,
      priority,
      startDate,
      endDate,
      passKey,
      description,
      userId,
      userName,
      targetUserId,
      taskFiles,
      typeOfUserRole,
      teamMembers: teamMembersArr,
      whoCreated: user._id,
      headOfOrganization: headOfId,
    };

    const newTask = new TaskModel(doc);
    await newTask.save();
    return res.status(201).json({ message: "task created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "add trainer failed", error });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    await TaskModel.deleteOne({ _id: taskId });
    return res.status(204).json({ message: "task deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "add trainer failed", error });
  }
};

export const onEditTask = async (req, res) => {
  const { taskId } = req.params;
  const { email } = req;
  const {
    taskName,
    priority,
    startDate,
    endDate,
    passKey,
    description,
    deletedFiles,
    teamMembers,
  } = req.body;
  // console.log(teamMembers);
  // console.log(req.body);
  let de;

  let team;
  if (teamMembers.length > 0) {
    team = teamMembers.split(",");
  }

  if (deletedFiles.length > 0) {
    de = deletedFiles?.split(",");
    // console.log(de);
    if (de && Array.isArray(de)) {
      // console.log("dfghjkl;'");
      de.forEach((filePath) => {
        const fullPath = join(__dirname, "..", filePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete file: ${filePath}`, err);
          } else {
            console.log(`Deleted file: ${filePath}`);
          }
        });
      });

      await TaskModel.updateOne(
        { _id: taskId },
        { $pull: { taskFiles: { $in: de } } }
      );
    }
  }
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const updateFields = {};

    // const files = req.newFiles;

    if (taskName) updateFields.taskName = taskName; // Corrected to taskName
    if (priority) updateFields.priority = priority;
    if (startDate) updateFields.startDate = startDate;
    if (endDate) updateFields.endDate = endDate;
    if (passKey) updateFields.passKey = passKey;
    if (description) updateFields.description = description;
    if (team.length > 0) {
      updateFields.teamMembers = team;
    } else {
      updateFields.teamMembers = [];
    }

    // console.log("hgvhjm");
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map((file) => file.path);
      await TaskModel.updateOne(
        { _id: taskId },
        { $push: { taskFiles: { $each: newFiles } } }
      );
    }

    const task = await TaskModel.findByIdAndUpdate(
      { _id: taskId },
      { $set: updateFields },
      { new: true }
    );
    return res.status(200).json({ message: "task updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "add trainer failed", error });
  }
};

export const onFetchingTaskIdWithTaskName = async (req, res) => {
  const { taskId, taskName } = req.params;
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const singleTask = await TaskModel.findOne({
      $or: [{ _id: taskId }, { taskName: taskName }],
    });

    return res.status(200).json(singleTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "add trainer failed", error });
  }
};

export const onFetchingTaskIdWithTaskNameWithStartData = async (req, res) => {
  const { taskId, taskName } = req.params;
  const { email } = req;
  const { startDate } = req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const singleTask = await TaskModel.findOne({
      _id: taskId,
      taskName: taskName,
      startDate: startDate,
    });
    return res.status(200).json(singleTask);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "fetching student task failed..!", error });
  }
};

export const onFetchTrainerOwnTask = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const trainerOwnTask = await TaskModel.find({ targetUserId: user._id });

    return res.status(200).json(trainerOwnTask);
  } catch (error) {
    console.log("login user- errors", error);
    return res
      .status(500)
      .json({ message: "Fetch trainer own task failed", error });
  }
};

export const onFetching = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const trainerOwnTask = await TaskModel.find({
      $or: [
        { targetUserId: user._id },
        { teamMembers: { $in: [user._id] } }, // Check if user._id is in the teamMembers array
      ],
    });

    return res.status(200).json(trainerOwnTask);
  } catch (error) {
    console.log("login user- errors", error);
    return res
      .status(500)
      .json({ message: "Fetch trainer own task failed", error });
  }
};
