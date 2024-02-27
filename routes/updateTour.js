const express = require("express");
const router = express.Router();
const multer = require("multer");
const Tour = require("../models/Tour");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

async function getAdminUsername(adminId) {
  try {
    const adminUser = await User.findById(adminId);
    return adminUser.username;
  } catch (error) {
    throw new Error("Error fetching admin username");
  }
}

router.get("/", async (req, res) => {
  const adminId = req.user._id;
  const adminUsername = await getAdminUsername(adminId);
  try {
    const tours = await Tour.find();
    const error = req.query.error || null;
    const success = req.query.success || null;

    res.render("adminTour", {
      posts: tours,
      error: error,
      success: success,
      adminUsername: adminUsername.toUpperCase(),
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  } catch (error) {
    console.error("Error fetching tour data:", error);
    res.render("adminTour", {
      posts: [],
      error: "Post not found",
      success: null,
      admin: req.isAdmin,
      adminUsername: adminUsername.toUpperCase(),
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  }
});
router.post("/create", upload.array("images[]"), async (req, res) => {
  try {
    const {
      name,
      description,
      country,
      city,
      startDate,
      endDate,
      price,
      numberOfPersons,
      rating,
      videoLink,
    } = req.body;

    const imageUrls = req.files.map((file) => {
      const correctedPath = file.path.replace(/\\/g, "/");
      return correctedPath;
    });

    const newTour = new Tour({
      name,
      description,
      country,
      city,
      startDate,
      endDate,
      price,
      images: imageUrls,
      numberOfPersons,
      videoLink,
      rating,
      createdAt: Date.now(),
      updatedAt: null,
      deletedAt: null,
    });
    await newTour.save();

    res.redirect("/admin/tours/?success=Post%20created%20successfully");
  } catch (error) {
    console.error("Error adding tour:", error);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/:id", async (req, res) => {
  console.log("hel");
  const postId = req.params.id;
  const {
    name,
    description,
    country,
    city,
    startDate,
    endDate,
    price,
    numberOfPersons,
    rating,
    videoLink,
  } = req.body;

  try {
    await Tour.findByIdAndUpdate(postId, {
      name,
      description,
      country,
      city,
      startDate,
      endDate,
      price,
      numberOfPersons,
      rating,
      videoLink,
      updatedAt: Date.now(),
    });

    res.redirect("/admin/tours/?success=Post%20updated%20successfully");
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to handle deleting a post (DELETE method)
router.delete("/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const deletedPost = await Tour.findByIdAndDelete(postId);
    if (!deletedPost) {
      res.redirect("/admin/tours/?error=Post%20not%20found");
    }
    res.redirect("/admin/tours/?success=Post%20deleted%20successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
