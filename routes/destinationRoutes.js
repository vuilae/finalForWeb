const express = require("express");
const router = express.Router();
const axios = require("axios");
const Destination = require("../models/Destionation");

router.get("/", async (req, res) => {
  try {
    res.render("destinations", {
      hotels: null,
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
      includeFooter: true,
    });
  } catch (error) {
    console.error("Error fetching destination data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const searchTerm = req.body.hotelName;
    const options = {
      method: "GET",
      url: "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchDestinationOrHotel",
      params: { query: searchTerm },
      headers: {
        "X-RapidAPI-Key": "89e2827136msh70a7f02277d9814p17ed93jsn7c06ac7d31d3",
        "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);
    const data = response.data;
    if (!data || data.length === 0) {
      res.status(404).send("No hotel data found for the provided search term.");
      return;
    }

    const userId = req.user._id;

    const hotel = new Destination({
      user: userId,
      accessedAt: Date.now(),
      hotelData: data,
      searchTerm: searchTerm,
    });
    await hotel.save();

    const displayHotelData = await Destination.findOne({
      user: userId,
      searchTerm: searchTerm,
    });

    if (!displayHotelData) {
      res.status(404).send("Hotel data not found for this user.");
      return;
    }

    res.render("destinations", {
      hotels: displayHotelData.hotelData.data,
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
      includeFooter: false,
    });
  } catch (error) {
    console.error("Error fetching and saving hotel data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
