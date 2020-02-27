
var users = (userData , token)=>{
  
  let User = {
    user: {
      email : userData.email,
      token : token,
      username : userData.username,
      bio : userData.bio,
      image : userData.image
    }
  }
  return User;
}

module.exports = {
  users
}


