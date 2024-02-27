const express = require("express");
const router = express.Router();
const postRoutes = require("./updateTour");
const userRoutes = require("./updateUser");
const User = require("../models/User");

async function getAdminUsername(adminId) {
  try {
    const adminUser = await User.findById(adminId);
    return adminUser.username;
  } catch (error) {
    throw new Error("Error fetching admin username");
  }
}
router.get("/", async (req, res) => {
  try {
    const adminId = req.user._id;
    const adminUsername = await getAdminUsername(adminId);

    res.render("admin", {
      adminUsername: adminUsername.toUpperCase(),
      admin: req.isAdmin,
      translation: res.locals.translation,
      currentLanguage: req.session.language || "en",
    });
  } catch (error) {
    res.render("admin", {
      error: error.message,
      adminUsername: "couldn't get admin",
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  }
});
router.use("/tours", postRoutes);
router.use("/users", userRoutes);

module.exports = router;
