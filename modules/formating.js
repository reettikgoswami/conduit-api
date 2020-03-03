var users = (userData, token) => {

  let User = {
    user: {
      email: userData.email,
      token: token,
      username: userData.username,
      bio: userData.bio,
      image: userData.image
    }
  }
  return User;
}


// profile take two argument (view_profile , my user id);
var profile = (userData, userid = false) => {
  let following = false
  if (userid) {
    following = (userData.follower).includes(userid);
  }
  let profileFormat = {
      username: userData.username,
      bio: userData.bio,
      image: userData.image,
      following: following
  }
  return profileFormat;
}


var Article = (articles, userid = false) => {   
 let formattedArticle = [];
 
 articles.forEach((article)=>{
  let author = profile(article.author , userid);
  let favorited = false;
  if(userid){
      favorited = (article.favoritedBy).includes(userid);
  }
  var singleArtical = {
    slug: article.slug,
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favoritesCount: article.favoritedBy.length,
    favorited : favorited,
    author: author
  }
  formattedArticle.push(singleArtical);
})

//  take care about favorited true"
  return formattedArticle;
}

var  Comment = (comments , userid=false)=>{  
  let formatedComment = {comment : []};
  comments.forEach((comment)=>{
    let singleComment = {
      id : comment.id,
      createdAt : comment.createdAt,
      updatedAt : comment.updatedAt,
      body : comment.body,
      author : profile(comment.author , userid)
    }
    formatedComment.comment.push(singleComment);
  } 
    )
    return formatedComment;
}


module.exports = {
  users,
  profile,
  Article,
  Comment
}