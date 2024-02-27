const express = require("express");
const router = express.Router();
const axios = require("axios");
const Airline = require("../models/Airlines");

router.get("/", async (req, res) => {
  try {
    res.render("airlines", {
      airlines: null,
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  } catch (error) {
    console.error("Error fetching airline data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const airlineName = req.body.airlineName;

    const response = await axios.get(
      `https://api.api-ninjas.com/v1/airlines?name=${airlineName}`,
      {
        headers: {
          "X-Api-Key": "ROZAtcP/1OCYW3YZ0rrpog==9hjkhmkK79oVE9NL",
        },
      }
    );
    const data = response.data;

    const userId = req.user._id;

    const airline = new Airline({
      user: userId,
      accessedAt: Date.now(),
      airlineData: data,
      name: airlineName,
    });
    await airline.save();

    // Find the saved airline data
    const displayAirlineData = await Airline.findOne({
      user: userId,
      name: airlineName, 
    });

    if (!displayAirlineData) {
      res.status(404).send("Airline data not found for this user.");
      return;
    }

    res.render("airlines", {
      airlines: displayAirlineData.airlineData,
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
    });
  } catch (error) {
    console.error("Error fetching and saving airline data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
