const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  res.render("login", {
    errorMessage: null,
    admin: req.isAdmin,
    currentLanguage: req.session.language || "en",
    translation: res.locals.translation,
  });
});

router.post("/", async (req, res) => {
  let { username, password } = req.body;

  // Trim leading and trailing spaces and remove all spaces
  username = (username || "").trim().replace(/\s+/g, "");
  password = (password || "").trim().replace(/\s+/g, "");

  const user = await User.findOne({ username });

  if (!user) {
    return res.render("login", {
      errorMessage: "No such user found",
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    // Incorrect password
    return res.render("login", {
      errorMessage: "Incorrect password",
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  }

  // Generate JWT token
  const token = jwt.sign({ user }, "secret_key");
  res.cookie("token", token);

  // Check if user is an admin
  if (user.isAdmin) {
    res.redirect(`/admin?lang=${req.query.lang}`);
  } else {
    res.redirect(`/tours?lang=${req.query.lang}`);
  }
});

module.exports = router;
