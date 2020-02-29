var User = require("../model/user");
var Tags = require("../model/tags");
var Comment = require("../model/comment");
var Article = require("../model/article");

// let jwtfunction = require('../modules/jwt');
let formatting = require("../modules/formating");

var createArticle = async (req, res, next) => {
  try {
    let article = req.body.article;
    if (article.title && article.description && article.body) {
      let slug = article.title.toLowerCase().split(" ").join("-") + "-" + Date.now();
      article.slug = slug;
      article.author = req.user.userid;
      var createdArticle = await (await Article.create(article)).populate("author").execPopulate();

      res.json({
        article: formatting.Article(createdArticle, req.user.userid)
      });
    } else {
      res.json("title/description/body not be empty");
      return;
    }
  } catch (error) {
    next(error);
  }
}

var updateArticle = async (req, res, next) => {
  try {
    let slug = req.params.slug;
    let oldArticle = await Article.findOneAndUpdate({
      slug: slug
    }, req.body.article);
    let updatedArticle = await (await Article.findById(oldArticle.id)).populate("author").execPopulate();
    res.json({
      article: formatting.Article(updatedArticle, req.user.userid)
    });
  } catch (error) {
    next(error)
  }
}

var getArticle = async (req, res, next) => {
  let slug = req.params.slug;
  try {
    var article = await (await Article.findOne({
      slug: slug
    })).populate('author').execPopulate();
    if (req.user) {
      res.json({
        article: formatting.Article(article, req.user.userid)
      });
    } else {
      res.json({
        article: formatting.Article(article)
      });
    }
  } catch (error) {
    next(error);
  }
}

var deleteArticle = async (req, res, next) => {
  let slug = req.params.slug;
  try {
    var deleteArticle = await Article.findOneAndDelete({
      slug: slug
    });
    res.json(deleteArticle.title + " article deleted succufully ");
  } catch (error) {
    next(error);
  }
}

// have to do
var listArticle = async (req, res, next) => {
  var query = req.query;
  console.log(query);
}


var favorite = async (req, res, next) => {

  try {
    let slug = req.params.slug;
    var oldArticle = await Article.findOneAndUpdate({
      slug: slug
    }, {
      $addToSet: {
        favoritedBy: req.user.userid
      }
    });
    var updateArticle = await (await Article.findById(oldArticle.id)).populate("author").execPopulate();
    res.json({
      article: formatting.Article(updateArticle, req.user.userid)
    });
  } catch (error) {
    next(error);
  }
}

var unFavorite = async (req, res, next) => {
  try {
    let slug = req.params.slug;
    var oldArticle = await Article.findOneAndUpdate({
      slug: slug
    }, {
      $pull: {
        favoritedBy: req.user.userid
      }
    });
    var updateArticle = await (await Article.findById(oldArticle.id)).populate("author").execPopulate();
    res.json({
      article: formatting.Article(updateArticle, req.user.userid)
    });
  } catch (error) {
    next(error);
  }
}



var createComment = async (req, res, next) => {
  try {
    let articleSlug = req.params.slug;
    req.body.comment.author = req.user.userid
    let createdComment = await (await Comment.create(req.body.comment)).populate("author").execPopulate();

    var oldArticle = await Article.findOneAndUpdate({
      slug: articleSlug
    }, {
      $addToSet: {
        comment: createdComment.id
      }
    });
    console.log(req.user.userid);
    res.json(formatting.Comment([createdComment], req.user.userid));
  } catch (error) {
    next(error);
  }
}

var getAllComment = async (req, res, next) => {
  try {
    let articleSlug = req.params.slug;
    let article = await (await Article.findOne({
      slug: articleSlug
    })).populate({
      path : "comment",
      populate:{
        path : "author",
        model: "User"
      }
    }).execPopulate(); 

      if(req.user.userid){
      res.json(formatting.Comment( article.comment , req.user.userid));
      }else{
        res.json(formatting.Comment( article.comment));
      }
  } catch (error) {
    next(error);
  }
}


var deleteComment = async (req, res, next) => {
  try {
    let articleSlug = req.params.slug;
    let commentId = req.params.id;
    let deletedComment = await Comment.findByIdAndDelete(commentId);
    var articale = await Article.findOneAndUpdate({
      slug: articleSlug
    }, {
      $pull: {
        comment: commentId
      }
    });
    res.json("deleted the comment successfully");
  } catch (error) {
    next(error);
  }
}


module.exports = {

  createArticle,
  updateArticle,
  getArticle,
  deleteArticle,
  listArticle,
  favorite,
  unFavorite,
  createComment,
  getAllComment,
  deleteComment

}