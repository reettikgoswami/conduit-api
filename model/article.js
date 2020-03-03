var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var articleSchema = new Schema({
  slug: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  body: {
    type: String,
    require: true
  },
  tagList: [{
    type: String,
    lowercase: true
  }],
  favoritedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  comment: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
}, {
  timestamps: true
});


var Article = mongoose.model("Article", articleSchema);

module.exports = Article;