// const app = require("./server");

// const PORT = 3000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const analyzeRoute = require("./routes/analyze");

const app = express();
app.use(express.static("public"));

app.use(cors());
app.use(express.json());

app.use("/analyze", analyzeRoute);

module.exports = app;