var User = require("../model/user");
var Tags = require("../model/tags");
var Comment = require("../model/comment");
var Article = require("../model/article");

// let jwtfunction = require('../modules/jwt');
let formatting = require("../modules/formating");

var createArticle = async (req , res , next)=>{
   try {
    let article = req.body.article;
    if(article.title && article.description && article.body){
       let slug = article.title.toLowerCase().split(" ").join("-") + "-" + Date.now();
       article.slug = slug;
       article.author = req.user.userid;
     var createdArticle = await (await Article.create(article)).populate("author").execPopulate();
 
     res.json({article :formatting.Article(createdArticle , req.user.userid)});  
    }else{
      res.json("title/description/body not be empty");
      return;
    }    
   } catch (error) {
      next(error);
   }
}

var updateArticle = async (req ,res ,next)=>{
  try {
  let slug = req.params.slug;
  let oldArticle  = await Article.findOneAndUpdate({slug : slug} , req.body.article);  
  let updatedArticle = await(await Article.findById(oldArticle.id)).populate("author").execPopulate();
   
  console.log(updateArticle);

  res.json({article :formatting.Article(updatedArticle , req.user.userid)}); 
  } catch (error) {
    next(error)
  }
} 

var getArticle = async (req , res , next)=>{
   let slug = req.params.slug; 
  try {
    var article = await (await Article.findOne({slug : slug})).populate('author').execPopulate();
    if(req.user){
    res.json({article :formatting.Article(article ,req.user.userid)});
    }else{
      res.json({article :formatting.Article(article)});
    }
  } catch (error) {
    next(error);
  }
}

var deleteArticle = async (req , res , next)=>{
 let slug = req.params.slug;
 try {
  var deleteArticle = await Article.findOneAndDelete({slug : slug});
 res.json(slug + "deleted succufully  ")  
 } catch (error) {
   next(error);
 }
 
}


module.exports = {
  createArticle,
  updateArticle,
  getArticle,
  deleteArticle
}