const express = require("express");
const cors = require("cors");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./models");
const User = db.user;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Connect Database
db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: "Infinity" }));
process.setMaxListeners(0);

// Session Configuration
app.use(
  session({
    secret: process.env.GOOGLE_SECRET_KEY, // Replace "your_secret_key" with a real secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration for Google OAuth2
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.WEBSITE_LINK + "/api/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      let row = await User.findOne({
        where: { email: profile.emails[0].value },
      });
      const salt = await bcrypt.genSalt(10);
      let bcryptPwd = await bcrypt.hash(profile.id, salt);
      if (!row) {
        row = await User.create({
          firstname: profile.name.givenName,
          lastname: profile.name.familyName,
          email: profile.emails[0].value,
          password: bcryptPwd,
        });
      }
      return done(null, row);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, { id });
});

// Google OAuth2 routes
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  function (req, res) {
    const payload = {
      user: req.user.dataValues,
    };

    token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5 days",
    });
    res.redirect(`${process.env.WEBSITE_LINK}/signin?token=${token}`);
  }
);

// Define Routes
app.use("/api/summary", require("./routers/summary.router"));
app.use("/api/record", require("./routers/record.router"));
app.use("/api/auth", require("./routers/auth.router"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
