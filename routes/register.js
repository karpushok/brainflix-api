const express = require("express");
const router = express.Router();
const { handleNewRegistration } = require("../controllers/registerController");

// registration middleware
router.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
  
  next();
});

router.get("/", handleNewRegistration);

module.exports = router;



