var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var commentSchema = new Schema({
  body : {
    type: String,
    require : true,
  },
  author : {
    type : Schema.Types.ObjectId,
    ref  : "User"  
  }
} , { timestamps: true });


var Comment = mongoose.model("Comment" , commentSchema);


module.exports = Comment;

