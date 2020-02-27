var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");

var userRouter = require("./routes/v1/user")

// connect to the database
mongoose.connect(
  "mongodb://localhost/conduit-api", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  err => {
    if (err) {
      return console.log(err);
    }
    console.log("database connected to conduit-api");
  }
);

require('dotenv').config()

var app = express();
mongoose.set("useCreateIndex", true);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));



// router middleware

app.use("/api/v1/", userRouter); // check login /reg


// app.use("/users", usersRouter);





module.exports = app;