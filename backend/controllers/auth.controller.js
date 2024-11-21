const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../models");
const User = db.user;
require("dotenv").config();

exports.loadUser = async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    const row = await User.findOne({
      where: { id: req.user.id },
    });
    res.status(200).json({ token, data: row });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.errors[0].msg });
  }

  const { email, password } = req.body;

  try {
    const row = await User.findOne({
      where: { email: email },
    });

    if (!row) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, row.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: row.id,
        username: row.username,
        email: row.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token, data: row });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.errors[0].msg });
  }
  try {
    const { username, email, password } = req.body;
    let row = await User.findOne({
      where: { email: email },
    });
    if (row) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    let bcryptPwd = await bcrypt.hash(password, salt);

    const newRow = await User.create({
      username: username,
      email: email,
      password: bcryptPwd,
    });

    const payload = {
      user: {
        id: newRow.id,
        username: newRow.username,
        email: newRow.email,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, data: newRow });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
