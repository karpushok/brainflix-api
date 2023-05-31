const express = require('express')
const router = express.Router()


// middleware for validation
router.use((req, res, next) => {
  next()
})

//route videos
router.route('/').get((req, res) => {
  res.send('GET /videos')
})

//post
router.route('/').post((req, res) => {
    res.send('POST /videos')
  })

//route videos:id

module.exports = router