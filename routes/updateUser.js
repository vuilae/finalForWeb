const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Get all users
// Define a function to grab the admin username by ID
async function getAdminUsername(adminId) {
  try {
    const adminUser = await User.findById(adminId);
    return adminUser.username;
  } catch (error) {
    throw new Error("Error fetching admin username");
  }
}

async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.redirect("/admin/users/?error=User not found");
    }
  } catch (error) {
    return res.redirect(
      "/admin/users/?error=" + encodeURIComponent(error.message)
    );
  }

  res.user = user;
  next();
}

router.get("/", async (req, res) => {
  const adminId = req.user._id;

  try {
    // Fetch admin username
    const adminUsername = await getAdminUsername(adminId);

    // Fetch all users except the admin
    const users = await User.find({ _id: { $ne: adminId } });

    // Check if there's an error message in the query parameters
    const error = req.query.error || null;
    const success = req.query.success || null;

    res.render("adminUser", {
      users: users,
      adminUsername: adminUsername.toUpperCase(),
      error: error,
      success: success,
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  } catch (error) {
    res.render("adminUser", {
      error: error.message,
      adminUsername: null,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  }
});

// POST route to create a user
router.post("/create", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    username = (username || "").trim().replace(/\s+/g, "");
    email = (email || "").trim().replace(/\s+/g, "");
    password = (password || "").trim().replace(/\s+/g, "");

    // Check if a user with the same username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      // If user already exists, return an error message
      return res.redirect(
        "/admin/users/?error=User with this username or email already exists"
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save the new user to the database
    await newUser.save();

    res.redirect("/admin/users/?success=User%20created%20successfully");
  } catch (error) {
    res.redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }
});

// POST route to edit a user
router.put("/:id", getUser, async (req, res) => {
  try {
    let { username, password, email } = req.body;
    username = (username || "").trim().replace(/\s+/g, "");
    email = (email || "").trim().replace(/\s+/g, "");
    password = (password || "").trim().replace(/\s+/g, "");
    const user = res.user; // User fetched by the getUser middleware

    // Update the fields if provided
    const updateFields = {};
    if (username !== undefined && username !== "") {
      updateFields.username = username;
    }
    if (password !== undefined && password !== "") {
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }
    if (email !== undefined && email !== "") {
      updateFields.email = email;
    }

    // Add updatedAt field
    updateFields.updatedAt = new Date();

    // Update the user using findByIdAndUpdate
    await User.findByIdAndUpdate(user._id, updateFields);

    res.redirect("/admin/users/?success=User%20updated%20successfully");
  } catch (error) {
    res.redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }
});

// POST route to delete a user
router.delete("/:id", getUser, async (req, res) => {
  try {
    const user = res.user; // User fetched by the getUser middleware
    await User.findByIdAndDelete(user._id);
    res.redirect("/admin/users/?success=User%20deleted%20successfully");
  } catch (error) {
    res.redirect(`/admin/users?error=${encodeURIComponent(error.message)}`);
  }
});

module.exports = router;
