const fsPromises = require("fs").promises;
const path = require("path");
const uuid = require("uuid");
const videos = require("../data/videos.json");

const userDB = {
  users: videos.registration,
  setRegistration(user) {
    this.users = user;
  },
};

let updatedVideos = {}

const handleNewRegistration = (req, res) => {
  try {
    const newUUID = uuid.v4();

    userDB.setRegistration([...userDB.users, newUUID]);

    updatedVideos = {...videos, registration: userDB.users, videoDetails: [{[newUUID]: videos.videoDetailsDefault}] }

    //create user and save id
    fsPromises.writeFile(
      path.join(__dirname, "..", "data", "videos.json"),
      JSON.stringify(updatedVideos)
    );

    
    // //create user videos from default set by user id
    // fsPromises.writeFile(
    //   path.join(__dirname, "..", "data", "videos.json"),
    //   JSON.stringify({ ...videos, 
    //     videoDetails: [{[newUUID]: videos.videoDetailsDefault}]
    //   })
    //   );
      
    res.status(201).json({ api_key: newUUID });
    // //create user videosdetails from default set by user id
    // fsPromises.writeFile(
    //   path.join(__dirname, "..", "data", "videoDetails.json"),
    //   JSON.stringify({...videoDetails, [newUUID]: videoDetails.default})
    // )

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewRegistration, userDB };
