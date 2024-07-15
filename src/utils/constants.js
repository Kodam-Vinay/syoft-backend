const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateHashPassword = (data) => {
  return bcrypt.hash(data, Number(process.env.SALT_ROUNDS));
};
const generateToken = async (data) => {
  return jwt.sign({ userDetails: data }, process.env.JWT_SECRET_KEY);
};
const comparePasswordFn = async (enteredPassword, password) => {
  return await bcrypt.compare(enteredPassword.trim(), password);
};

const authorizeUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(400).send({ message: "Unauthorized User" });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(400).send({ message: "Token not provided" });
  }
};

module.exports = {
  generateHashPassword,
  generateToken,
  comparePasswordFn,
  authorizeUser,
};
