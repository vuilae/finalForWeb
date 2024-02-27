const express = require("express");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const app = express();

const tourRoutes = require("./routes/tours");
const login = require("./routes/login");
const admin = require("./routes/admin");
const airlineRoutes = require("./routes/airlineRoutes");
const booked = require("./routes/booked");
const hotelRoutes = require("./routes/hotelRoutes");
const register = require("./routes/register");
const changeLanguage = require("./routes/changeLanguage");

const PORT = 3000;
const MONGODB_CONNECTION_STRING =
  "mongodb+srv://vuilae:Aa102030@cluster0.jpwdrod.mongodb.net/?retryWrites=true&w=majority";

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.static("public"));
app.use("/images", express.static("images"));
app.use(cors());
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

mongoose.connect(MONGODB_CONNECTION_STRING);
mongoose.connection.on("connected", () =>
  console.log("Connection with MongoDB is established")
);

function loadTranslation(language) {
  const translation = fs.readFileSync(`languages/${language}.json`);
  return JSON.parse(translation);
}

// Define the lang middleware function
const lang = (req, res, next) => {
  console.log("heelo");
  const language = (req.query && req.query.lang) || "en";
  const translation = loadTranslation(language);
  req.session.language = language;
  res.locals.translation = translation;
  res.locals.currentLanguage = language;
  next();
};

// Define other middleware functions and route handlers here

// Middleware function to authenticate user
const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/");
  }

  try {
    const { user } = jwt.verify(token, "secret_key");
    if (user.isAdmin) {
      req.isAdmin = true;
    } else req.isAdmin = false;
    req.user = user;

    next();
  } catch (error) {
    return res.redirect("/");
  }
};

// Middleware function to authorize admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.render("adminForbidden", {
      translation: res.locals.translation,
      currentLanguage: req.session.language || "en",
      isAdmin: req.isAdmin
    });
  }
  next();
};

// Define route handlers and use middleware functions
app.use(lang); // Use the lang middleware for all routes
app.use((req, res, next) => {
  if (
    req.path === "/" ||
    req.path.startsWith("/login") ||
    req.path.startsWith("/register") 
  ) {
    next(); // Allow access to "/", "/login" and "/register" routes without authentication
  } else {
    authenticateUser(req, res, next); // Apply authentication middleware to other routes
  }
});

app.use("/admin", authorizeAdmin, admin);
app.use("/login", login);
app.use("/register", register);
app.use("/tours", tourRoutes);
app.use("/hotels", hotelRoutes);
app.use("/booked", booked);
app.use("/airlines", airlineRoutes);
app.use("/change-language", changeLanguage);

app.get("/", (req, res) => {
  res.render("home", {
    admin: req.isAdmin,
    currentLanguage: req.session.language || "en",
    translation: res.locals.translation,
  });
});

app.listen(PORT, () => {
  console.log(`App is listening on: http://localhost:${PORT}`);
});
