var express = require('express');
var router = express.Router();

var Controller = require("../../controller/profileControl");
var jwtfunction = require("../../modules/jwt");


router.get("/:username" , jwtfunction.validateJWT , Controller.searchProfile)

router.post("/:username/follow" , jwtfunction.validateJWT , Controller.followUser)
// POST /api/profiles/:username/follow

router.delete("/:username/follow" , jwtfunction.validateJWT , Controller.unFollowUser)
// DELETE /api/profiles/:username/follow  => unfollow


module.exports = router;