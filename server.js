require("dotenv").config(); // ✅ MUST be first

const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyze");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/analyze", analyzeRoute);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});