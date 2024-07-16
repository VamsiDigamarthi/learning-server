import UserModel from "../modals/UserModal.js";
import ExamWithMcqModel from "../modals/examWithMcq.js";
import MaterialModel from "../modals/materialModal.js";
import StudentExamSchema from "../modals/studentExamModal.js";
import nodemailer from "nodemailer";
import StudentExamModel from "../modals/studentExamModal.js";

export const onAddMaterials = async (req, res) => {
  const { email } = req;
  const { courseName, topic, passkey, selectType, availableOn, description } =
    req.body;
  // console.log(req.body);
  // console.log(req.file);
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const docs = {
      courseName,
      topic,
      passkey,
      selectType,
      availableOn,
      description,
      pdf: req.file.path,
      Author: user._id,
    };

    const newUser = new MaterialModel(docs);
    await newUser.save();
    return res.status(201).json({ message: "updaload materials..!" });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const fetchAllPdfs = async (req, res) => {
  const { email } = req;

  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const result = await MaterialModel.find({ Author: user._id });
    return res.status(200).json(result);
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onAddExams = async (req, res) => {
  const { email } = req;
  const { examId, courseName, topic, level, mcqs, description } = req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    let transformedArray = mcqs?.map((obj) => {
      let { Option1, Option2, Option3, Option4, Option5, ...rest } = obj; // Destructuring to remove "email"
      return {
        ...rest,
        asnwers: [Option1, Option2, Option3, Option4, Option5 && Option5],
      }; // Adding "city" field
    });

    const docs = {
      examId,
      courseName,
      topic,
      level,
      description,
      mcqs: transformedArray,
      head: user._id,
    };

    const newExam = new ExamWithMcqModel(docs);
    await newExam.save();
    return res.status(201).json({ message: "exam assigned successfully..!" });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

// new
export const onAddCodingQuestio = async (req, res) => {
  const { email } = req;
  const { examId, courseName, topic, level, mcqs, description } = req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    let transformedArray = mcqs?.map((obj) => {
      let { Option1, Option2, Option3, Option4, Option5, ...rest } = obj; // Destructuring to remove "email"
      return {
        ...rest,
        asnwers: [Option1, Option2, Option3, Option4, Option5 && Option5],
      }; // Adding "city" field
    });
  } catch (error) {
    console.log("Coding user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onGetAllExams = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const exams = await ExamWithMcqModel.find({ head: user._id }).select(
      "examId courseName topic level"
    );

    return res.status(200).json(exams);
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onAddStudents = async (req, res) => {
  const { students, course } = req.body;

  try {
    const headOfUser = await UserModel.findOne({ email: req.email });

    if (!headOfUser) {
      return res.status(404).json({ message: "User Not Found..!" });
    }

    // console.log(students);

    for (let student of students) {
      let user = await UserModel.findOne({ email: student.email });

      if (user) {
        console.log(user);
        user.courses.push({ ...course, instructorId: headOfUser._id });
        await user.save();
      } else {
        user = new UserModel({
          firstName: student.firstName,
          lastName: student.lastName,
          email: student.email,
          password: student.password,
          role: student.role,
          userName: student.userName,
          studentId: student.studentId,
          courses: [{ ...course, instructorId: headOfUser._id }],
        });

        await user.save();
      }
    }
    return res.status(201).json({ message: "New user created with course." });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchingAllStudents = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const users = await UserModel.aggregate([
      // Match documents where at least one course has the specified instructorId
      { $match: { "courses.instructorId": user._id } },

      // Unwind the courses array to denormalize
      { $unwind: "$courses" },

      // Match again to filter only the courses with the specified instructorId
      {
        $match: {
          "courses.instructorId": user._id,
        },
      },

      // Group by courseName to aggregate users
      {
        $group: {
          _id: {
            courseName: "$courses.courseName",
            batchId: "$courses.batchId",
            purpose: "$courses.purpose",
            description: "$courses.description",
          },
          users: {
            $push: {
              _id: "$_id",
              firstName: "$firstName",
              lastName: "$lastName",
              email: "$email",
              password: "$password",
              role: "$role",
              courses: "$courses",
            },
          },
        },
      },
    ]);

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for the given instructorId." });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchingAllStudentsProjects = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const users = await UserModel.aggregate([
      // Match documents where at least one course has the specified instructorId
      { $match: { "courses.instructorId": user._id } },

      // Unwind the courses array to denormalize
      { $unwind: "$courses" },

      // Match again to filter only the courses with the specified instructorId
      { $match: { "courses.instructorId": user._id } },

      // Group by batchId and courseName to aggregate users
      {
        $group: {
          _id: {
            batchId: "$courses.batchId",
            courseName: "$courses.courseName",
          },
          students: {
            $push: {
              _id: "$_id",
              firstName: "$firstName",
              lastName: "$lastName",
              email: "$email",
              // role: "$role",
              // courses: "$courses",
            },
          },
        },
      },
    ]);

    const exams = await ExamWithMcqModel.aggregate([
      { $match: { head: user._id } },
      {
        $group: {
          _id: "$_id", // This will include the _id field of each document
          examId: { $first: "$examId" },
          courseName: { $first: "$courseName" },
          topic: { $first: "$topic" },
          level: { $first: "$level" },
          // mcqs: { $first: "$mcqs" },
          // description: { $first: "$description" },
        },
      },
    ]);

    return res.status(200).json({ users, exams });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

const sendEmails = async (user, courseName, dateAndTime, time, passkey) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Hostinger's SMTP server
    port: 465, // Secure SMTP port
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // console.log("if block exicuted");
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Your ${courseName} Exam Has Been Scheduled Successfully!`,
    text: `Dear ${user?.firstName}
                We are excited to inform you that your exam for ${courseName} has been scheduled successfully. Here are the important details you need to know:

                Exam Details:
                  Subject: ${courseName}
             
                  Date: ${dateAndTime}
                  Time: ${time}

                User Name -- ${user.userName}
                password -- ${user.password}
                 passKey : ${passkey}

                Thank you for choosing our services, and we wish you the best of luck on your ${courseName} exam!
                Best Regards,
                DHARANI
                NUHVIN BLOOD BANK TEAM
                
             `,
    html: `<div>
                  <h2>Dear ${user?.firstName}</h2>
                  <p>We are excited to inform you that your exam for ${courseName} has been scheduled successfully. Here are the important details you need to know: </p>
                  <h3> Exam Details:</h3>
                  <ul>
                    <li>Subject: ${courseName}</li>
               
                    <li>Date: ${dateAndTime}</li>
                    <li>Time: ${time}</li>
                  
                  </ul>

                  <h3>User Name -- ${user.userName}</h3>
                  <h3>password -- ${user.password}</h3>
                  <h3>passKey: ${passkey}</h3>

                  <p>Thank you for choosing our services, and we wish you the best of luck on your ${courseName} exam!</p>
                  <p>Best regards,</p>
                  <h4>
                     DHARANI
                  </h4>
                  <h4>
                    NUHVIN BLOOD BANK TEAM
                  </h4>
             </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send email to ${user.email}: ${error.message}`);
  }
};

export const onAddTest = async (req, res) => {
  const { email } = req;
  const {
    testId,
    batchId,
    courseName,
    date,
    time,
    passKey,
    purpose,
    examsSections,
    students,
    resultType,
    description,
  } = req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const docs = {
      testId,
      batchId,
      batchName: courseName,
      date,
      time,
      passKey,
      purpose,
      resultType,
      description,
      examsSections: examsSections,
      students: students,
      head: user._id,
    };
    const newExam = new StudentExamSchema(docs);
    await newExam.save();

    students.map(async (obj) => {
      const user = await UserModel.findOne({ _id: obj.studentId });
      // console.log(user);
      sendEmails(user, courseName, date, time, passKey);
    });

    return res.status(201).json({ message: "test added successfully...!" });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onFetchingAllTests = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const result = await StudentExamModel.find({ head: user._id });
    return res.status(200).json(result);
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onEditTest = async (req, res) => {
  const { cutOff, resultType } = req.body;
  console.log(req.params.testId);
  console.log(cutOff, resultType);
  try {
    if (req.params.testId && resultType) {
      await StudentExamModel.updateOne(
        { _id: req.params.testId }, // Filter by document _id
        {
          $set: {
            "examsSections.$[elem].resultType": resultType, // Update resultType in examsSections
            cutOff: cutOff, // Add or update cutOff field in the main document
          },
        },
        {
          arrayFilters: [{ "elem._id": { $exists: true } }], // Filter for all elements in examsSections
        }
      );
      return res.status(201).json({ message: "Updated successfully" });
    } else {
      return res.status(400).json({ message: "Please send resultType" });
    }
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onDeleteTest = async (req, res) => {
  const { id } = req.params;
  try {
    await StudentExamModel.deleteOne({ _id: id });

    return res.status(204).json({ message: "Test deleted successfully//!" });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onEditExam = async (req, res) => {
  const { level, mcqsToAdd } = req.body; //
  try {
    const updatedDocument = await ExamWithMcqModel.findOneAndUpdate(
      { _id: req.params.id }, // Filter by document _id
      {
        $set: { level: level }, // Update 'level' field
        $push: { mcqs: { $each: mcqsToAdd } }, // Add new MCQs to 'mcqs' array
      },
      { new: true } // To return the updated document
    );

    if (!updatedDocument) {
      return res.status(404).json({ message: "Document not found" });
    }

    return res
      .status(200)
      .json({ message: "Updated successfully", updatedDocument });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onDeleteExam = async (req, res) => {
  const { id } = req.params;
  try {
    await ExamWithMcqModel.deleteOne({ _id: id });

    return res.status(204).json({ message: "Exam deleted successfully//!" });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onDeleteBatch = async (req, res) => {
  const { batchId, batchName, purpose } = req.body; // Assuming these fields are passed in the request body

  try {
    const updatedDocuments = await UserModel.updateMany(
      {
        "courses.batchId": batchId,
        "courses.courseName": batchName,
        "courses.purpose": purpose,
      },
      {
        $pull: {
          courses: {
            batchId: batchId,
            courseName: batchName,
            purpose: purpose,
          },
        },
      }
    );

    if (updatedDocuments.nModified === 0) {
      return res
        .status(404)
        .json({ message: "No matching documents found or no courses deleted" });
    }

    return res.status(200).json({
      message: "Courses deleted successfully from matching documents",
    });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
