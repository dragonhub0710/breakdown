const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { check } = require("express-validator");
const authController = require("../controllers/auth.controller");

router.get("/", auth, authController.loadUser);
router.post(
  "/signin",
  check("email", "Please include a valid email").isEmail(),
  authController.signin
);
router.post(
  "/signup",
  check("email", "Please include a valid email").isEmail(),
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 }),
  authController.signup
);

module.exports = router;
