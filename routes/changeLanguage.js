const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const language = req.body.language;
  req.session.language = language;

  // Get the referer URL
  var currentUrl = req.headers.referer || "/";

  // Remove any existing lang query parameter
  currentUrl = currentUrl.replace(/[\?&]lang=[^&]+/, "");

  // Add or update the lang query parameter with the new language value
  const separator = currentUrl.includes("?") ? "&" : "?";
  currentUrl = `${currentUrl}${separator}lang=${language}`;

  console.log(currentUrl);
  res.redirect(currentUrl);
});

module.exports = router;
