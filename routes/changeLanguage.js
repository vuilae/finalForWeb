const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const language = req.body.language;
  req.session.language = language;
  var currentUrl = req.headers.referer || "/";
  const langQueryParamIndex = currentUrl.indexOf("?lang=");
  if (langQueryParamIndex !== -1) {
    currentUrl =
      currentUrl.substring(0, langQueryParamIndex) + `?lang=${language}`;
  } else {
    const separator = currentUrl.includes("?") ? "&" : "?";
    currentUrl = `${currentUrl}${separator}lang=${language}`;
  }
  console.log(langQueryParamIndex, currentUrl);
  res.redirect(currentUrl);
});

module.exports = router;
