import UserModel from "../modals/UserModal.js";
import ExamWithMcqModel from "../modals/examWithMcq.js";
import StudentExamModel from "../modals/studentExamModal.js";

export const onAddedNewCourse = async (req, res) => {
  const { id } = req.params;
  const { newCourse } = req.body;
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.course.includes(newCourse)) {
      user.course.push(newCourse);
      await user.save();
      return res
        .status(200)
        .json({ message: "Course added successfully", user });
    } else {
      return res
        .status(400)
        .json({ message: "Course already exists in user's list" });
    }
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllTrainer = async (req, res) => {
  try {
    const trainer = await UserModel.find({ role: "2" });
    return res.status(200).json(trainer);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllTest = async (req, res) => {
  try {
    const result = await StudentExamModel.find({}).populate({
      path: "head",
      select: "firstName lastName trainerId",
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllStudent = async (req, res) => {
  try {
    const users = await UserModel.aggregate([
      {
        $match: { role: "3" },
      },
      {
        $unwind: "$courses",
      },
      {
        $lookup: {
          from: "users", // Collection name in MongoDB
          localField: "courses.instructorId",
          foreignField: "_id",
          as: "instructorDetails",
        },
      },
      {
        $unwind: "$instructorDetails",
      },
      {
        $group: {
          _id: {
            courseName: "$courses.courseName",
            batchId: "$courses.batchId",
          },
          purpose: { $first: "$courses.purpose" },
          users: {
            $push: {
              _id: "$_id",
              firstName: "$firstName",
              lastName: "$lastName",
              email: "$email",
            },
          },
          instructor: { $first: "$instructorDetails" },
        },
      },
      {
        $project: {
          _id: 0,
          courseName: "$_id.courseName",
          batchId: "$_id.batchId",
          purpose: 1,
          users: 1,
          instructor: {
            _id: "$instructor._id",
            firstName: "$instructor.firstName",
            lastName: "$instructor.lastName",
            email: "$instructor.email",
          },
        },
      },
    ]);

    return res.status(200).json(users);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllExams = async (req, res) => {
  try {
    const result = await ExamWithMcqModel.find({})
      .populate({
        path: "head",
        select: "firstName trainerId lastName",
      })
      .select("-mcqs");
    return res.status(200).json(result);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
