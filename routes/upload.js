const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const { userDB } = require("../controllers/registerController");

const multer = require("multer");

const fsPromises = require("fs").promises;
const path = require("path");

let registeredUser = "";

router.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");

  // have registration? req api_key?
  // have user in videos.json
  const isRegistered = uuid.validate(req.query.api_key);

  if (isRegistered && userDB.users.includes(req.query.api_key)) {
    registeredUser = req.query.api_key;
    next();
  } else {
    res.status(401).json({ message: "Please register!" });
  }
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: "public/images",
  filename: (req, file, callback) => {
    const filename = registeredUser + "-" + file.originalname;
    callback(null, filename);
  },
});

const upload = multer({ storage });

// Custom middleware using multer
const uploadMiddleware = upload.single("file");

router.route("/").post(uploadMiddleware, async (req, res) => {
  const videos = require("../data/videos.json");
  const findUserById = videos["videoDetails"].find(
    (user) => user[registeredUser] !== undefined
  );

  const { title, description } = req.body;

  try {
    const videoTemplate = {
      id: uuid.v4(),
      title: title,
      channel: "Guest",
      image: "/images/" + registeredUser + "-" + req.file.originalname,
      description: description,
      views: "0",
      likes: "0",
      duration: "4:01",
      video: "https://project-2-api.herokuapp.com/stream",
      timestamp: Date.now(),
      comments: [],
    };

    const findUserById = videos["videoDetails"].find(
      (user) => user[registeredUser] !== undefined
    );

    findUserById[registeredUser].push(videoTemplate);

    const updatedUsers = videos.videoDetails.map((user) => {
      if (user[registeredUser] !== undefined) {
        return findUserById;
      }
      return user;
    });

    const updatedVideos = { ...videos, videoDetails: updatedUsers };

    //save updated user data
    fsPromises.writeFile(
      path.join(__dirname, "..", "data", "videos.json"),
      JSON.stringify(updatedVideos)
    );

    res.send("Poster saved successfully");
  } catch (err) {
    console.error("Error downloading image:", err);
    res.status(500).send("Error downloading image");
  }
});

module.exports = router;
