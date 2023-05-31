const express = require('express')
const router = express.Router()
const {handleNewRegistration} = require('../controllers/registerController')

// registration middleware
router.use((req, res, next) => {
  next()
})

router.get('/', handleNewRegistration)

module.exports = router