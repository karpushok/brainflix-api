const express = require('express')
const router = express.Router()
const uuid = require('uuid')
const {userDB} = require('../controllers/registerController')

let registeredUser = ''

// middleware for validation
router.use((req, res, next) => {
  
  // have registration? req api_key?
  // have user in videos.json

  const isRegistered = uuid.validate(req.query.api_key)

  if (isRegistered && userDB.users.includes(req.query.api_key)) {
    registeredUser = req.query.api_key
    next()
  } else {
    res.status(401).json({message: 'Please register!'})
  }

})

//route videos
router.route('/').get((req, res) => {
  const videos = require('../data/videos.json')
  res.status(200).json(videos[registeredUser])

})

//post
router.route('/').post((req, res) => {
    res.send('POST /videos')
  })

//route videos:id

router.route('/:id').get((req, res) => {
  const videos = require('../data/videos.json')
  const findVideo = videos[registeredUser].find((video) => video.id === req.params.id)

  res.status(200).json(findVideo)
})


module.exports = router