const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const {userDB} = require( "../controllers/registerController" );

const axios = require('axios');
const fs = require( 'fs' );
const fsPromises = require("fs").promises;
const path = require("path");

const videos = require("../data/videos.json");

let registeredUser = "";

// middleware for validation
//TODO 
/**
  * put in a separate middleware folder
  **/
router.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');

  // have registration? req api_key?
  // have user in videos.json
  const isRegistered = uuid.validate(req.query.api_key);

  if (isRegistered && userDB.users.includes(req.query.api_key)) {
    registeredUser = req.query.api_key;
    next();
  } else {
    res.status(401).json({ message: "Please register!" });
  }

  //TODO 
  /**
    * cases
    * 
    * Server should answer with status code 400 and corresponding message if userId is invalid (not uuid)
      Server should answer with status code 404 and corresponding message if record with id === userId doesn't exist
    * 
    **/

});

router.route( "/" ).post( async ( req, res ) => {

  const videos = require("../data/videos.json");
  const findUserById = videos["videoDetails"].find( user => user[registeredUser] !== undefined )
  
  const {imgSrc, title, description } = req.body;

  const obj = {
    "imgSrc": "https://i.imgur.com/4TSJsRK.jpeg",
    "title": "test title",
    "description": "test description"
  }

  try {
    
    const imageResponse = await axios.get( imgSrc, { responseType: 'stream' } );

    const localImgName = registeredUser + '-' + imgSrc.split( '/' )[3] 

    const imagePath = path.join( __dirname, "..", "public", "images", `${ localImgName }` );
    
    console.log(`upload.js - line: 64 ->> imagePath`, imagePath)

    const outputStream = fs.createWriteStream(imagePath);

    imageResponse.data.pipe(outputStream);

    outputStream.on('finish', () => {
      console.log('Image saved successfully');
      res.send('Image saved successfully');
    });

    outputStream.on('error', (err) => {
      console.error('Error saving image:', err);
      res.status(500).send('Error saving image');
    } );

//TODO 
/**
  * write new videos to user's profile data
  * 
  * 
  * 
  **/

  const videoTemplate = {
    "id": uuid.v4(),
    "title": title,
    "channel": "Guest",
    "image": '/images/' + localImgName,
    "description": description,
    "views": "0",
    "likes": "0",
    "duration": "4:01",
    "video": "https://project-2-api.herokuapp.com/stream",
    "timestamp": Math.floor(Date.now()),
    "comments": []
  }

    const findUserById = videos["videoDetails"].find( user => user[registeredUser] !== undefined )

    findUserById[registeredUser].push(videoTemplate)

    const updatedUsers = videos.videoDetails.map((user) => {
      if (user[registeredUser] !== undefined) {
        return findUserById
      }
      return user
    })

    const updatedVideos = {...videos, videoDetails: updatedUsers }

    //save updated user data
    fsPromises.writeFile(
      path.join(__dirname, "..", "data", "videos.json"),
      JSON.stringify(updatedVideos)
    );

    
  } catch (err) {
    console.error('Error downloading image:', err);
    res.status(500).send('Error downloading image');
  }

})

module.exports = router


