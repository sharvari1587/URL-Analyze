const express = require("express");
const router = express.Router();
const analyzeURL = require("../utils/analyzer");

router.post("/", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const result = await analyzeURL(url);
    res.json(result);

  } catch (err) {
    res.status(500).json({ error: "Analysis failed" });
  }
});

module.exports = router;