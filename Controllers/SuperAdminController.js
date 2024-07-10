import PostfeedbackModel from "../modals/PostFeedBack.js";
import UserModel from "../modals/UserModal.js";
import ExamWithMcqModel from "../modals/examWithMcq.js";
import MaterialModel from "../modals/materialModal.js";
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

// completed
export const onFetchAllTest = async (req, res) => {
  try {
    const result = await StudentExamModel.find({}).populate({
      path: "head",
      select: "firstName lastName trainerId email",
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
    const result = await ExamWithMcqModel.find({}).populate({
      path: "head",
      select: "firstName trainerId lastName",
    });
    // .select("-mcqs");
    return res.status(200).json(result);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

// 05-07-2024

export const onGetAllBatchStudents = async (req, res) => {
  try {
    const groupedStudents = await UserModel.aggregate([
      {
        $unwind: "$courses", // Unwind the courses array
      },
      {
        $group: {
          _id: {
            batchId: "$courses.batchId",
            courseName: "$courses.courseName",
            purpose: "$courses.purpose",
            description: "$courses.description",
          },
          students: {
            $push: {
              firstName: "$firstName",
              lastName: "$lastName",
              email: "$email",
              password: "$password",
            },
          },
          instructorId: {
            $first: "$courses.instructorId",
          },
        },
      },
      {
        $lookup: {
          from: "users", // Assuming the collection name is 'users'
          localField: "instructorId",
          foreignField: "_id",
          as: "instructor",
        },
      },
      {
        $unwind: "$instructor",
      },
      {
        $project: {
          _id: 0,
          batchId: "$_id.batchId",
          courseName: "$_id.courseName",
          purpose: "$_id.purpose",
          description: "$_id.description",
          students: 1,
          instructor: {
            _id: "$instructor._id",
            firstName: "$instructor.firstName",
            lastName: "$instructor.lastName",
            email: "$instructor.email",
            trainerId: "$instructor.trainerId",
          },
        },
      },
    ]);

    res.json(groupedStudents);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllMentors = async (req, res) => {
  try {
    const mentor = await UserModel.find({
      role: "2",
    });

    return res.status(200).json(mentor);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onDeletementor = async (req, res) => {
  const { trainerId } = req.params;
  try {
    await UserModel.deleteOne({ _id: trainerId });
    return res.status(204).json({ message: "deleted..!" });
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllMaterialByTrainer = async (req, res) => {
  const { trainerId, courseName } = req.params;
  // console.log(trainerId);
  try {
    const material = await MaterialModel.find({
      Author: trainerId,
      courseName: courseName,
    });

    return res.status(200).json(material);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onPostFeedBack = async (req, res) => {
  // console.log(req.body.feedBackQuestions);
  try {
    const docs = {
      instructorId: req.body.instructorId,
      courseName: req.body.courseName,
      trainerName: req.body.trainerName,
      designation: req.body.designation,
      feedBackQuestions: req.body.feedBackQuestions,
      // questionType: req.body.questionType,
    };

    const newModal = new PostfeedbackModel(docs);

    await newModal.save();

    return res.status(201).json({ message: "FeedBack Questions Added...!" });
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
