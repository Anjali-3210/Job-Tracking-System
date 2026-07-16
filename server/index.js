require("dotenv").config();

const express = require("express");

const app = express();



app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});