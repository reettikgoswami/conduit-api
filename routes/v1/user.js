var express = require('express');
var router = express.Router();

var userController = require("../../controller/userControl")
var jwtfunction = require("../../modules/jwt");

router.post('/users', userController.registration);

router.post("/users/login", userController.login);

router.get('/user', jwtfunction.validateJWT, userController.getCurrentUser);

router.put("/user", jwtfunction.validateJWT, userController.updateCurrentUser)

module.exports = router;