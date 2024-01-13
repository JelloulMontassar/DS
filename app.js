const express = require("express");
const app = express();

const mongoose = require('mongoose');
const userRoute = require("./routes/userRoutes")
mongoose.connect("mongodb://127.0.0.1:27017/DsNodeJs2")
.then(() => console.log('Connected!'));
app.use(express.json())
app.get('/', (req, res) => {
    res.send('Hello World!');
  });
app.use("/user",userRoute)

module.exports =app;