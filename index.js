const express = require("express");
const dotenv = require("dotenv");
const videos = require("./routes/videos");
const register = require("./routes/register");
const path = require('path');

dotenv.config();

const PORT = process.env.PORT || 4444;
const app = express();

// middleware to work wtih json
app.use(express.json());

//handle routes
app.use("/videos", videos);
app.use("/register", register);
app.use(express.static(path.join(__dirname, 'public')))

app.get("/", (req, res) => {
  res.json({
    message: "Hello from backend express.js",
  });
});

app.listen(PORT, () => {
  console.log(`Server starting on port ${PORT}`);
});



// const express = require('express');
// const path = require('path');

// const app = express();
// const port = 8080;

// // Указывает путь к папке, содержащей фотографии на сервере
// const imagesPath = path.join(__dirname, 'assets/images');

// // Middleware для обслуживания статических файлов
// app.use(express.static(imagesPath));

// app.listen(port, () => {
//   console.log(`Сервер запущен на порту ${port}`);
// });
