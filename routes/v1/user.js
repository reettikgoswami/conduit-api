var express = require('express');
var router = express.Router();

var userController = require("../../controller/userControl")
var articleController= require("../../controller/articlesControl");
var jwtfunction = require("../../modules/jwt");

router.post('/users', userController.registration);

router.post("/users/login", userController.login);

router.get('/user', jwtfunction.validateJWT, userController.getCurrentUser);

router.put("/user", jwtfunction.validateJWT, userController.updateCurrentUser)

router.get("/tags" , userController.getTagList);

router.get("/articles/feed"  ,jwtfunction.validateJWT , articleController.getFeed);


module.exports = router;