var express = require('express');
var router = express.Router();

var Controller = require("../../controller/articlesControl");
var jwtfunction = require("../../modules/jwt");


router.get("/" , jwtfunction.middlewareJWT, Controller.listArticle);

router.post("/" , jwtfunction.validateJWT  , Controller.createArticle)

router.put("/:slug" , jwtfunction.validateJWT  , Controller.updateArticle);

router.get("/:slug" , jwtfunction.middlewareJWT , Controller.getArticle);

router.delete("/:slug" ,jwtfunction.validateJWT , Controller.deleteArticle);


router.post("/:slug/favorite" ,jwtfunction.validateJWT , Controller.favorite);

router.delete("/:slug/favorite" ,jwtfunction.validateJWT , Controller.unFavorite);


router.post("/:slug/comments" , jwtfunction.validateJWT , Controller.createComment);

router.get("/:slug/comments" , jwtfunction.middlewareJWT ,Controller.getAllComment);

router.delete("/:slug/comments/:id" , jwtfunction.validateJWT , Controller.deleteComment);


module.exports = router;