import FeedbackModel from "../modals/FeedbackModal.js";
import OrganizationFeedbackModel from "../modals/OrganizationFeedbackmodal.js";
import PostfeedbackModel from "../modals/PostFeedBack.js";
import UserModel from "../modals/UserModal.js";
import ExamWithMcqModel from "../modals/examWithMcq.js";
import MaterialModel from "../modals/materialModal.js";
import StudentExamModel from "../modals/studentExamModal.js";
import TaskModel from "../modals/taskModal.js";

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
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const trainer = await UserModel.find({ head: user._id });
    return res.status(200).json(trainer);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

// completed
export const onFetchAllTest = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const result = await StudentExamModel.find({
      headOfOrganization: user._id,
    }).populate({
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
  const { email } = req;

  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const result = await ExamWithMcqModel.find({
      headOfOrganization: user._id,
    }).populate({
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
  const { email } = req;

  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const mentor = await UserModel.find({
      role: "2",
      head: user._id,
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
  const { email } = req;

  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const docs = {
      instructorId: req.body.instructorId,
      courseName: req.body.courseName,
      trainerName: req.body.trainerName,
      designation: req.body.designation,
      feedBackQuestions: req.body.feedBackQuestions,
      // questionType: req.body.questionType,
      headOfOrganization: user._id,
    };

    const newModal = new PostfeedbackModel(docs);

    await newModal.save();

    return res.status(201).json({ message: "FeedBack Questions Added...!" });
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onAddTriner = async (req, res, next) => {
  const { email } = req;
  const {
    firstName,
    lastName,
    trainerEmail,
    trainerId,
    designation,
    course,
    password,
    key,
    joiningDate,
  } = req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const docs = {
      firstName,
      lastName,
      email: trainerEmail,
      password,
      role: "2",
      trainerId,
      course: [course],
      key,
      designation,
      joiningDate,
      head: user._id,
    };
    // console.log(docs);

    const newUser = new UserModel(docs);
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchSuperAdminTrainerTask = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const allTrainerTask = await TaskModel.find({
      headOfOrganization: user._id,
      typeOfUserRole: "2",
    });
    return res.status(200).json(allTrainerTask);
  } catch (error) {
    console.log("super admin fetch trainer task failed", error);
    return res
      .status(500)
      .json({ message: "super admin fetch trainer task failed", error });
  }
};

export const onFetchSuperAdminStudentTask = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const allTrainerTask = await TaskModel.find({
      headOfOrganization: user._id,
      typeOfUserRole: "3",
    });
    return res.status(200).json(allTrainerTask);
  } catch (error) {
    console.log("super admin fetch trainer task failed", error);
    return res
      .status(500)
      .json({ message: "super admin fetch trainer task failed", error });
  }
};

export const onOrganizationOwnFeedback = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const docs = {
      feedBackQuestions: req.body.feedBackQuestions,
      headOfOrganization: user._id,
    };

    const newModal = new OrganizationFeedbackModel(docs);

    await newModal.save();

    return res.status(201).json({ message: "FeedBack Questions Added...!" });
  } catch (error) {
    console.log("Organization added feebback failed", error);
    return res
      .status(500)
      .json({ message: "Organization added feebback failed", error });
  }
};

export const onOrganizationFetchTrainerFeedbackGiveStudent = async (
  req,
  res
) => {
  const { email } = req;
  const { instructorId, courseName } = req.params;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const trainerFeedback = await FeedbackModel.find({
      instructorId: instructorId,
      courseName: courseName,
    });

    return res.status(200).json(trainerFeedback);
  } catch (error) {
    console.log("Organization added feedback failed", error);
    return res
      .status(500)
      .json({ message: "Organization Fetch feedback failed", error });
  }
};
