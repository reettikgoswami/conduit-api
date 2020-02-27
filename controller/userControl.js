var User = require("../model/user");

let jwtfunction = require('../modules/jwt');
let formatting = require("../modules/formating");

var registration = async (req, res, next) => {
  // console.log(req.body.user);
  try {
    let createdUser = await User.create(req.body.user);
    let token = await jwtfunction.generateJwtToken(createdUser, next);

    //api responce 
    let Userformat = formatting.users(createdUser, token);
    res.json(Userformat);
  } catch (error) {
    console.log(error)
    next(error);
  }
}
var login = async (req, res, next) => {
  try {
    var {
      email,
      password
    } = req.body.user;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email & password required "
      })
    }
    var user = await User.findOne({
      email: email
    });
    if (!user) {
      return res.status(400).json({
        error: "invalid Email"
      })
    }
    var checkpassword = await user.verifyPassword(password, next);
    if (!checkpassword) {
      return res.status(400).json({
        error: "invalid password"
      });
    }
    let token = await jwtfunction.generateJwtToken(user, next);
    //api responce 
    let Userformat = formatting.users(user, token);
    res.json(Userformat);
  } catch (error) {
    next(error);
  }
}
var getCurrentUser = async (req, res, next) => {
  let currentUser = await User.findById(req.user.userid);

  //api responce 
  let Userformat = formatting.users(currentUser, req.headers["authorization"]);
  res.json(Userformat);
}
var updateCurrentUser = async (req, res, next) => {

  try {
    var oldInfo = await User.findByIdAndUpdate(req.user.userid, req.body.user);
    var newInfo = await User.findById(req.user.userid);

    let Userformat = formatting.users(newInfo, req.headers["authorization"]);
    res.json(Userformat);

  } catch (error) {
    next(error)
  }

}

module.exports = {
  registration,
  login,
  getCurrentUser,
  updateCurrentUser
}