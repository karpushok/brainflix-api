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

router.route('/:id').get((req, res) => {
  res.send(`GET /videos/${req.params.id}`)
})

//route videos:id

module.exports = router