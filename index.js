const express = require ('express');
const dotenv = require('dotenv')

dotenv.config()

const PORT = process.env.PORT || 4444;
const app = express();

app.get('/', (req, res) => {
    res.json({
        message: "Hello from backend express.js",
    })
})

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
})