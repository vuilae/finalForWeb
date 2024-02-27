const express = require("express");
const router = express.Router();
const axios = require("axios");
const Hotel = require("../models/Hotel");

router.get("/", async (req, res) => {
  console.log(req.session.language || "en");
  try {
    res.render("hotels", {
      hotels: null,
      admin: req.isAdmin,
      currentLanguage: req.session.language || "en",
      translation: res.locals.translation,
      includeFooter: true,
    });
  } catch (error) {
    console.error("Error fetching hotel data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const searchTerm = req.body.hotelName;
    // const options = {
    //   method: "GET",
    //   url: "https://sky-scrapper.p.rapidapi.com/api/v1/hotels/searchDestinationOrHotel",
    //   params: { query: searchTerm },
    //   headers: {
    //     "X-RapidAPI-Key": "fa63bda591mshddbd5d3726d27dep1702f7jsn6f6bd972cd7a",
    //     "X-RapidAPI-Host": "sky-scrapper.p.rapidapi.com",
    //   },
    // };

    // const response = await axios.request(options);
    // const data = response.data;
    // if (!data || data.length === 0) {
    //   res.status(404).send("No hotel data found for the provided search term.");
    //   return;
    // }
    

    const userId = req.user._id;

    // const hotel = new Hotel({
    //   user: userId,
    //   accessedAt: Date.now(),
    //   hotelData: data,
    //   searchTerm: searchTerm,
    // });
    // await hotel.save();

    const displayHotelData = await Hotel.findOne({
      user: userId,
      searchTerm: searchTerm,
    });

    if (!displayHotelData) {
      res.status(404).send("Hotel data not found for this user.");
      return;
    }
    

    res.render("hotels", {
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
