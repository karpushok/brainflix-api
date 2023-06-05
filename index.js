const express = require("express");
const dotenv = require("dotenv");
const videos = require("./routes/videos");
const register = require("./routes/register");
const upload = require("./routes/upload");
const path = require('path');

dotenv.config();

const PORT = process.env.PORT || 4444;
const app = express();

// middleware to work wtih json
app.use(express.json());
app.use( express.urlencoded( {extended: true} ) );

//handle routes
app.use("/videos", videos);
app.use("/register", register);
app.use("/upload", upload)
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.json({
    message: "Hello from backend express.js",
  });
});

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});
