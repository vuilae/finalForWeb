const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("register", {
    errorMessage: null,
    admin: req.isAdmin,
    translation: res.locals.translation,
    currentLanguage: req.session.language || "en",
  });
});

router.post("/", async (req, res) => {
  let { username, email, password } = req.body;
  username = (username || "").trim().replace(/\s+/g, "");
  email = (email || "").trim().replace(/\s+/g, "");
  password = (password || "").trim().replace(/\s+/g, "");

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.render("register.ejs", {
        errorMessage: "Username already exists",
        admin: req.isAdmin,
        currentLanguage: req.session.language || "en",
        translation: res.locals.translation,
      });
      return;
    }
    let isAdmin = false;
    // Check if the user is an admin based on specific criteria
    if (
      password === "darina123" &&
      email === "darina@gmail.com" &&
      username === "darina"
    ) {
      isAdmin = true;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();
    res.redirect(`/login?lang=${req.query.lang}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
