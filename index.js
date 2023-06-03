const express = require("express");
const dotenv = require("dotenv");
const videos = require("./routes/videos");
const register = require("./routes/register");
const path = require('path');

dotenv.config();

const PORT = process.env.PORT || 4444;
const app = express();

// middleware to work wtih json
app.use(express.json());

//handle routes
app.use("/videos", videos);
app.use("/register", register);
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.json({
    message: "Hello from backend express.js",
  });
});

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});
