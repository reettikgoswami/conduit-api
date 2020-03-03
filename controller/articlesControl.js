var User = require("../model/user");
var Comment = require("../model/comment");
var Article = require("../model/article");

let formatting = require("../modules/formating");

var createArticle = async (req, res, next) => {
  try {
    let article = req.body.article;
    if (article.title && article.description && article.body) {
      let slug = article.title.toLowerCase().split(" ").join("-") + "-" + Date.now();
      article.slug = slug;
      article.author = req.user.userid;
      var createdArticle = await (await Article.create(article)).populate("author").execPopulate();
      let creater = await User.findByIdAndUpdate(req.user.userid, {
        $addToSet: {
          article: createdArticle.id
        }
      });
      res.json({
        article: formatting.Article([createdArticle], req.user.userid)
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
    // find article using slug
    let findArticle = await Article.findOne({
      slug: slug
    }).populate("author").exec();
    // find user using jwt token
    let user = await User.findById(req.user.userid);
    if (findArticle && (user.article).includes(findArticle.id)) {
      let updatedArticle = await Article.findByIdAndUpdate(findArticle.id, req.body.article, {
        new: true
      }).populate("author").exec();
      res.json({
        article: formatting.Article([updatedArticle], req.user.userid)
      })
    } else {
      res.json("You are not author of that article");
    }

  } catch (error) {
    next(error)
  }
}

var getArticle = async (req, res, next) => {
  try {
    let slug = req.params.slug;
    var article = await Article.findOne({
      slug: slug
    }).populate('author').exec();
    // if article doesnot exist
    if (!article) {
      res.json("article not found");
      return;
    }
    // formatting 
    if (req.user) {
      res.json({
        article: formatting.Article([article], req.user.userid)
      });
    } else {
      res.json({
        article: formatting.Article([article])
      });
    }
  } catch (error) {
    next(error);
  }
}

// delete associated comment also
// delete associated favorates also
var deleteArticle = async (req, res, next) => {
  let slug = req.params.slug;
  try {
    var deleteArticle = await Article.findOneAndDelete({
      slug: slug
    });
    // if article donot exist
    if (!deleteArticle) {
      res.json("article not found");
      return;
    }
    // remove the article ids from the users
    let updatedUser = await User.findByIdAndUpdate(req.user.userid, {
      $pull: {
        article: deleteArticle.id
      }
    });
    res.json(deleteArticle.title + " article deleted succufully ");
  } catch (error) {
    next(error);
  }
}

var favorite = async (req, res, next) => {
  try {
    let slug = req.params.slug;
    var updateArticle = await Article.findOneAndUpdate({
      slug: slug
    }, {
      $addToSet: {
        favoritedBy: req.user.userid
      }
    }, {
      new: true
    }).populate("author").exec();

    // if updated article not found 
    if (!updateArticle) {
      return res.json("Article not found")
    }

    let creater = await User.findByIdAndUpdate(req.user.userid, {
      $addToSet: {
        favoritArticle: updateArticle.id
      }
    }, {
      new: true
    });
    res.json({
      article: formatting.Article([updateArticle], req.user.userid)
    });
  } catch (error) {
    next(error);
  }
}

var unFavorite = async (req, res, next) => {
  try {
    let slug = req.params.slug;
    var updateArticle = await Article.findOneAndUpdate({
      slug: slug
    }, {
      $pull: {
        favoritedBy: req.user.userid
      }
    }, {
      new: true
    }).populate("author").exec();
    // if article does not exist
    if (!updateArticle) {
      return res.json("Article not found");
    }
    let creater = await User.findByIdAndUpdate(req.user.userid, {
      $pull: {
        favoritArticle: updateArticle.id
      }
    });
    res.json({
      article: formatting.Article([updateArticle], req.user.userid)
    });
  } catch (error) {
    next(error);
  }
}

var createComment = async (req, res, next) => {
  try {
    let articleSlug = req.params.slug;
    // check article exist or not
    if (!await Article.findOne({
        slug: articleSlug
      })) {
      return res.json("Article not found");
    }

    req.body.comment.author = req.user.userid
    let createdComment = await (await Comment.create(req.body.comment)).populate("author").execPopulate();

    var updatedArticle = await Article.findOneAndUpdate({
      slug: articleSlug
    }, {
      $addToSet: {
        comment: createdComment.id
      }
    }, {
      new: true
    });

    res.json(formatting.Comment([createdComment], req.user.userid));
  } catch (error) {
    next(error);
  }
}

var getAllComment = async (req, res, next) => {
  try {
    let articleSlug = req.params.slug;
    // if article not exist
    if (!await Article.findOne({
        slug: articleSlug
      })) {
      return res.json("Article not found");
    }
    let article = await (await Article.findOne({
      slug: articleSlug
    })).populate({
      path: "comment",
      populate: {
        path: "author",
        model: "User"
      }
    }).execPopulate();

    if (req.user) {
      res.json(formatting.Comment(article.comment, req.user.userid));
    } else {
      res.json(formatting.Comment(article.comment));
    }
  } catch (error) {
    next(error);
  }
}

var deleteComment = async (req, res, next) => {
  try {
    let articleSlug = req.params.slug;
    let commentId = req.params.id;
    let article = await Article.findOne({
      slug: articleSlug
    });
    let comment = await Comment.findById(commentId);
    if (!article) {
      return res.json("Article not exist");
    }
    if (!comment) {
      return res.json("Comment not exist");
    }
    if (article.author == req.user.userid || comment.author == req.user.userid) {
      let deletedComment = await Comment.findByIdAndDelete(commentId);
      var articale = await Article.findOneAndUpdate({
        slug: articleSlug
      }, {
        $pull: {
          comment: commentId
        }
      });
      res.json("Comment deleted successfully");
    } else {
      return res.json("User are not authorized to delete the comment");
    }

  } catch (error) {
    next(error);
  }
}

var listArticle = async (req, res, next) => {
  try {

    let limit = req.query.limit || 20;
    let skip = req.query.offset || 0;
    let articleList = [];

    if (req.query.tag) {
      articleList = await Article.find({
        tagList: req.query.tag
      }).sort({
        createdAt: -1
      }).limit(limit).populate("author").exec();

      // res.json(articleList);
    } else if (req.query.author) {
      articleList = await User.findOne({
        username: req.query.author
      }).limit(limit).populate({
        path: "article",
        populate: {
          path: "author",
          model: "User"
        }
      }).exec();
      // check the username exist or not
      if (!articleList) {
        return res.json("user name doesnot exist")
      }
      articleList = articleList.article.sort((a, b) => b.createdAt - a.createdAt)
    } else if (req.query.favorited) {
      articleList = await (await User.findOne({
        username: req.query.favorited
      }).limit(Number(limit))).populate({
        path: "favoritArticle",
        populate: {
          path: "author",
          model: "User"
        }
      }).execPopulate();

      if (!articleList) {
        return res.json("user doesnot exist")
      }
      articleList = articleList.favoritArticle.sort((a, b) => b.createdAt - a.createdAt);

    } else if (req.query.limit) {

      articleList = await Article.find().sort({
        createdAt: -1
      }).limit(Number(limit)).populate("author").exec();

    } else if (req.query.offset) {
      articleList = await Article.find().sort({
        createdAt: -1
      }).skip(Number(skip)).populate("author").exec();
    }

    if (req.user) {
      res.json({
        articale: formatting.Article(articleList, req.user.userid)
      });
    } else {
      res.json({
        articale: formatting.Article(articleList)
      });
    }

  } catch (error) {
    next(error);
  }

}

var getFeed = async (req, res, next) => {
   try {
    let limit = req.query.limit || 20;
    let offset = req.query.offset || 0;
    let user = await User.findById(req.user.userid);
    let feedArticle = await Article.find({
      "author": {
        $in: user.following
      }
    }).sort({
      createdAt: -1
    }).limit(Number(limit)).skip(Number(offset)).populate("author").exec();
    res.json({
      articale: formatting.Article(feedArticle , req.user.userid)
    });
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
  deleteComment,
  getFeed
}