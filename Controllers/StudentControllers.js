import UserModel from "../modals/UserModal.js";
import StudentExamModel from "../modals/studentExamModal.js";
import MaterialSchema from "../modals/materialModal.js";
import ExamWithMcqModel from "../modals/examWithMcq.js";
import QuizeModel from "../modals/quizeMOdal.js";
import MaterialModel from "../modals/materialModal.js";
import FeedbackModel from "../modals/FeedbackModal.js";
import PostfeedbackModel from "../modals/PostFeedBack.js";
export const onFetchingAllExams = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    const exams = await StudentExamModel.find({
      "students.studentId": user._id,
    })
      .select(
        "testId head courseName date time resultType passKey purpose examsSections students.afterWritingExams students.totalMark"
      )
      .populate("examsSections.examuniqueId", "examId mcqs")
      .populate("students.studentId", "firstName lastName email");
    const filteredExams = exams.map((exam) => {
      const filteredStudents = exam.students.filter((student) =>
        student.studentId._id.equals(user._id)
      );
      return {
        ...exam.toObject(),
        students: filteredStudents,
      };
    });

    return res.status(200).json(filteredExams);
    // return res.status(200).json(exams);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchingPdfs = async (req, res) => {
  const { email } = req;

  const { courseName, instructorId } = req.params;
  console.log(courseName, instructorId);
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    const pdfs = await MaterialSchema.find({
      Author: instructorId,
      courseName: courseName,
    });

    return res.status(200).json(pdfs);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchingMcqs = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }
    // Fetch exams based on examsIds array
    const mcqs = await ExamWithMcqModel.find({
      _id: { $in: req.body?.map((id) => id) },
    });

    const groupedByCourseName = mcqs.reduce((acc, exam) => {
      if (!acc[exam.courseName]) {
        acc[exam.courseName] = {
          courseName: exam.courseName,
          mcqs: [],
        };
      }
      acc[exam.courseName].mcqs.push(...exam.mcqs);
      return acc;
    }, {});

    // Convert the grouped object to an array
    const result = Object.values(groupedByCourseName);

    return res.status(200).json(result);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchQuized = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    if (req.body?.length > 0) {
      const quize = await QuizeModel.find({
        head: { $in: req.body },
      });
      return res.status(200).json(quize);
    } else {
      return res
        .status(401)
        .json({ message: "Not Data Fount Please send Intructors Details" });
    }
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

// fetch all mentors

export const onFetchAllMentors = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({ email }).populate({
      path: "courses.instructorId",
      select: "firstName lastName email role course", // Specify the fields you want to include
    });

    if (!user) {
      return res.status(200).json(user);
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllMaterials = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    if (req.body?.length > 0) {
      const quize = await MaterialModel.find({
        Author: { $in: req.body },
      });
      return res.status(200).json(quize);
    } else {
      return res
        .status(401)
        .json({ message: "Not Data Fount Please send Intructors Details" });
    }
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onSubmittedExam = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    if (!req.body) {
      return res.status(400).json({ message: "No data send form client ...!" });
    }

    let totalMark = 0;
    if (req?.body?.length > 0) {
      req?.body?.forEach((each) => (totalMark += each.totalMarks));
      console.log(totalMark);
    }
    const result = await StudentExamModel.updateOne(
      { _id: req.params.id, "students.studentId": user._id },
      {
        $set: {
          "students.$.afterWritingExams": req.body,
          "students.$.totalMark": totalMark,
        },
      }
    );
    return res.status(201).json({ message: "Updated....!" });
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onPreview = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    const testDataVisibleOrNot = await StudentExamModel.findOne({
      _id: req.params.id,
    });

    if ("Hidden" === testDataVisibleOrNot?.examsSections[0].resultType) {
      return res
        .status(400)
        .json({ message: "This Exam Score Not Visible For you" });
    }

    const result = await StudentExamModel.findOne(
      { "students._id": user._id, _id: req.params.id },
      {
        head: 1,
        testId: 1,
        batchId: 1,
        batchName: 1,
        date: 1,
        time: 1,
        passKey: 1,
        purpose: 1,
        examsSections: 1,
        students: { $elemMatch: { _id: user._id } },
      }
    );

    if (!result) {
      return res.status(404).send("Student not found");
    }

    res.json(result);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onAddFeebBack = async (req, res) => {
  const { email } = req;
  const { courseName, rating, instructorId, feedbackform, trainerName } =
    req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    const docs = {
      courseName,
      rating,
      instructorId,
      feedbackform,
      creater: user._id,
      trainerName,
    };

    const feeBack = new FeedbackModel(docs);

    await feeBack.save();

    return res
      .status(201)
      .json({ message: "Feed-back added successfully...!" });
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchFeedBack = async (req, res) => {
  const { instructorId, courseName } = req.params;
  try {
    if (courseName) {
      const feebBack = await PostfeedbackModel.findOne({
        instructorId,
        courseName,
      });
      return res.status(200).json(feebBack);
    } else {
      const feebBack = await PostfeedbackModel.findOne({
        instructorId,
      });
      return res.status(200).json(feebBack);
    }
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchSuperAdmin = async (req, res) => {
  try {
    const superAdmin = await UserModel.findOne({ role: "1" }).select(
      "firstName"
    );
    return res.status(200).json(superAdmin);
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchFeedBackOrganization = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const feebBack = await PostfeedbackModel.findOne({
      instructorId,
    });
    return res.status(200).json(feebBack);
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchAllFeebBack = async (req, res) => {
  const { email } = req;

  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    const feeback = await FeedbackModel.find({ creater: user._id });
    return res.status(200).json(feeback);
  } catch (error) {
    console.log("feedback fetch student failed...!", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
