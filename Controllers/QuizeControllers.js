import UserModel from "../modals/UserModal.js";
import QuizeModel from "../modals/quizeMOdal.js";

export const onAddQuizeMcqs = async (req, res) => {
  const { email } = req;
  const { quizeId, courseName, topic, level, mcqs, description, date } =
    req.body;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    let transformedArray = mcqs.map((obj) => {
      let { Option1, Option2, Option3, Option4, Option5, ...rest } = obj; // Destructuring to remove "email"
      return {
        ...rest,
        asnwers: [Option1, Option2, Option3, Option4, Option5 && Option5],
      }; // Adding "city" field
    });

    const docs = {
      quizeId,
      courseName,
      topic,
      level,
      date,
      mcqs: transformedArray,
      description,
      head: user._id,
    };

    const newQuize = new QuizeModel(docs);
    await newQuize.save();
    return res.status(201).json({ message: "Quize created successfully..!" });
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const getAllQuize = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(200).json(user);
    }

    const result = await QuizeModel.find({ head: user._id }).select(
      "quizeId courseName topic level date"
    );
    res.status(200).json(result);
  } catch (error) {
    console.log("register user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
