const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const { userDB } = require("../controllers/registerController");

let registeredUser = "";

// middleware for validation

//TODO 
/**
  * put in a separate middleware folder
  **/

router.use((req, res, next) => {
  // have registration? req api_key?
  // have user in videos.json

  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

  const isRegistered = uuid.validate(req.query.api_key);

  if (isRegistered && userDB.users.includes(req.query.api_key)) {
    registeredUser = req.query.api_key;
    next();
  } else {
    res.status(401).json({ message: "Please register!" });
  }
});

//route videos
router.route("/").get((req, res) => {
  const videos = require("../data/videos.json");
  const findUserById = videos["videoDetails"].find( user => user[registeredUser] !== undefined )
  

  res.status(200).json(findUserById[registeredUser]);
});

//post
router.route("/").post((req, res) => {
  res.send("POST /videos");
});

//route videos:id
router.route("/:id").get((req, res) => {
  const videos = require("../data/videos.json");

  const findUserById = videos["videoDetails"].find( user => user[registeredUser] !== undefined )

  console.log(`videos.js - line: 50 ->> findUserById`, findUserById, Array.isArray(findUserById))

  const findVideo = findUserById[registeredUser].find((video) => video.id === req.params.id);

  //TODO 
  /**
    * add status 404 if record by such id is not found
    **/


  res.status(200).json(findVideo);
});

module.exports = router;
