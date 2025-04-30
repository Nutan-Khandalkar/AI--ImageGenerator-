const express=require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRouter=require("../routes/user");

const app = express();
const PORT = 9898;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/UserDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Connection Error:", err));


app.use("/user",userRouter);
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});









