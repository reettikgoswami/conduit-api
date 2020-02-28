var User = require("../model/user");

let jwtfunction = require('../modules/jwt');
let formatting = require("../modules/formating");

var searchProfile = async (req, res, next) => {
  var username = req.params.username;
  try {
    var searchprofile = await User.findOne({
      username: username
    })
    // 2nd argument change according to the following
    let following = false
    if(req.user){
     following = (searchprofile.follower).includes(req.user.userid);   
    }
    res.json(formatting.profile(searchprofile , following));
  } catch (error) {
    next(error);
  }
}

var followUser = async (req, res , next)=>{
    // POST /api/profiles/:username/follow   
    try {
      var follow_userName = req.params.username;

      var follow_user = await User.findOneAndUpdate({username : follow_userName} , { $addToSet: { follower : req.user.userid } } );
        
      var myProfile = await User.findByIdAndUpdate(req.user.userid , { $addToSet: { following : follow_user.id }})
   
     //==================================
     let followUserCurrentData = await User.findById(follow_user.id);

    let following = false;
    following = (followUserCurrentData.follower).includes(myProfile.id);   
     //============================================
     res.json(formatting.profile(followUserCurrentData , following));

    } catch (error) {
      next(error);
    }
}

var unFollowUser = async (req , res , next)=>{
  try {
    var follow_userName = req.params.username;

    var follow_user = await User.findOneAndUpdate({username : follow_userName} , { $pull: { follower : req.user.userid } } );

    var myProfile = await User.findByIdAndUpdate(req.user.userid , { $pull: { following : follow_user.id }})
    
       //==================================
     let followUserCurrentData = await User.findById(follow_user.id);

     let following = false;
     following = (followUserCurrentData.follower).includes(myProfile.id);   
      //============================================
      res.json(formatting.profile(followUserCurrentData , following));

    res.json(myProfile);

  } catch (error) {
    next(error);
  } 
}

module.exports = {
  searchProfile,
  followUser,
  unFollowUser
}