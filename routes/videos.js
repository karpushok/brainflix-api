const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const { userDB } = require("../controllers/registerController");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

let registeredUser = "";

// middleware for validation

//TODO
/**
 * put in a separate middleware folder
 **/

router.use((req, res, next) => {
  // have registration? req api_key?
  // have user in videos.json

  res.append("Access-Control-Allow-Origin", ["*"]);
  res.append("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.append("Access-Control-Allow-Headers", "Content-Type");

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
  const findUserById = videos["videoDetails"].find(
    (user) => user[registeredUser] !== undefined
  );

  res.status(200).json(findUserById[registeredUser]);
});

//post comment
router.route("/:id/comments").post((req, res) => {
  const objComment = {
    comment: "...",
    name: "Guest",
  };

  const { comment, name } = req.body;

  const commentTemplate = {
    id: uuid.v4(),
    name: name,
    comment: comment,
    likes: 0,
    timestamp: Date.now(),
  };

  const videos = require("../data/videos.json");

  const findUserById = videos["videoDetails"].find(
    (user) => user[registeredUser] !== undefined
  );

  const findVideo = findUserById[registeredUser].find(
    (video) => video.id === req.params.id
  );

  if (findVideo) {
    findVideo.comments.push(commentTemplate);

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

    res.status(200).json(commentTemplate);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

//post video like
router.route("/:id/like").post((req, res) => {
  const videos = require("../data/videos.json");

  const findUserById = videos["videoDetails"].find(
    (user) => user[registeredUser] !== undefined
  );

  const findVideo = findUserById[registeredUser].find(
    (video) => video.id === req.params.id
  );

  if (findVideo) {
    findVideo.likes = Number(findVideo.likes) + 1;

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

    res.status(200).json(findVideo);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

//delete comment
router.route("/:id/comments/:commentId").delete((req, res) => {
  const videos = require("../data/videos.json");

  const findUserById = videos["videoDetails"].find(
    (user) => user[registeredUser] !== undefined
  );

  const findVideo = findUserById[registeredUser].find(
    (video) => video.id === req.params.id
  );

  const findCommentIdx = findVideo.comments.findIndex(
    (comment) => comment.id === req.params.commentId
  );

  if (findCommentIdx !== -1) {
    findVideo.comments.splice(findCommentIdx, 1);

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

    res.status(200).json(findVideo[findCommentIdx]);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

//route videos:id
router.route("/:id").get((req, res) => {
  const videos = require("../data/videos.json");

  const findUserById = videos["videoDetails"].find(
    (user) => user[registeredUser] !== undefined
  );

  const findVideo = findUserById[registeredUser].find(
    (video) => video.id === req.params.id
  );

  if (findVideo) {
    findVideo.views = Number(findVideo.views) + 1;

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

    res.status(200).json(findVideo);
  } else {
    res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
