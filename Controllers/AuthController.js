import UserModel from "../modals/UserModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import TodoModel from "../modals/todoModal.js";

export const onRegisterUser = async (req, res) => {
  const { firstName, lastName, email, password, role, course, key, trainerId } =
    req.body;

  // const saltRounds = 10;
  // const salt = bcrypt.genSaltSync(saltRounds);
  // const hashPassword = bcrypt.hashSync(password, salt);

  try {
    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exist..!" });
    }

    const docs = {
      firstName,
      lastName,
      email,
      password,
      role,
      trainerId,
      course: [course],
      key,
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

export const onLoginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (user) {
      // console.log(user.password);
      // console.log(await bcrypt.compare(password, user.password));
      if (password === user.password) {
        const payload = {
          email: user.email,
        };
        const jwtToken = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
        return res.status(200).json({ token: jwtToken });
      } else {
        return res.status(400).json({
          message: "Password is in-correct...!",
        });
      }
    } else {
      return res.status(401).json({ message: "Un-Authorized....!" });
    }
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const onGetProfile = async (req, res) => {
  const { email } = req;

  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (user) {
      return res.status(200).json(user);
    }
    return res.status(404).json({ message: "User does't exist...!" });
  } catch (error) {
    console.log("login user- errors", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

export const onAddTodo = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const doc = {
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      time: req.body.time,

      head: user._id,
    };

    const todo = new TodoModel(doc);

    await todo.save();
    return res.status(201).json({
      message: "add todo successfully..!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
      error,
    });
  }
};

export const onGetAllTodo = async (req, res) => {
  const { email } = req;
  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const result = await TodoModel.find({
      head: user._id,
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
      error,
    });
  }
};

export const onUpdateTodo = async (req, res) => {
  try {
    const todo = await TodoModel.findOne({ _id: req.params.id });
    if (todo) {
      const updatedTodo = await TodoModel.findByIdAndUpdate(
        req.params.id,
        { $set: { mark: !todo.mark } },
        { new: true } // Option to return the updated document
      );
      return res
        .status(201)
        .json({ message: "updated successfully...!", updatedTodo });
    } else {
      return res.status(404).json({ message: "todo not found..!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
      error,
    });
  }
};
