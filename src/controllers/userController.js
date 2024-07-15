const validator = require("validator");
const UserModel = require("../models/userModel");
const {
  generateHashPassword,
  generateToken,
  comparePasswordFn,
} = require("../utils/constants");
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (
      !username?.toString().trim() ||
      !email?.toString().trim() ||
      !password?.toString().trim() ||
      !role?.toString().trim()
    ) {
      return res.status(400).send({ message: "Fields must not to be Empty" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: "Email is Invalid" });
    }
    const checkUserExistWithEmail = await UserModel.findOne({ email });
    if (checkUserExistWithEmail) {
      return res.status(400).send({ message: "Email Id Already Exist" });
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).send({
        message:
          "Password Not Meet the criteria, it Must includes(password length 8 or more charaters, 1 uppercase letter, 1 special symbol)",
      });
    }
    const checkRole =
      role === "admin" || role === "manager" || role === "staff";
    if (!checkRole) {
      return res.status(400).send({
        message: "Role Should be either admin (or) manager (or) staff",
      });
    }

    const hashedPassword = await generateHashPassword(password);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      role,
    });
    const user = await newUser.save();
    const details = {
      username: user?.username,
      email: user?.email,
      role: user?.role,
    };
    const token = await generateToken(details);
    const sendDetails = {
      ...details,
      token,
    };
    res.status(201).send({ message: "User created", userDetails: sendDetails });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "User Not Exist" });
    }
    const checkPassword = await comparePasswordFn(password, user?.password);
    if (!checkPassword) {
      return res.status(400).send({ message: "Password is Incorrect" });
    }
    const details = {
      username: user?.username,
      email: user?.email,
      role: user?.role,
    };
    const token = await generateToken(details);
    const sendDetails = {
      ...details,
      token,
    };
    res.status(200).send({ userDetails: sendDetails });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong" });
  }
};

module.exports = {
  register,
  login,
};
