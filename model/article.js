var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var articleSchema = new Schema({
  slug : {
    type : String,
    unique: true
  },
  title : {
    type : String,
    required : true,
  },
  description:{
     type:String,
     required : true
  },
  body: {
    type : String,
    require : true
  },
  tagList :[ {
    type : String,
    lowercase : true
  }],
  favoritedBy :[{
   type :  Schema.Types.ObjectId,
   ref : "User"
  }],
  // favoritesCount :{
  //   type : Number,
  //   default : 0
  // },
  author : {
    type : Schema.Types.ObjectId,
    ref : "User"
  },
  // add the userid or username inside the comment who comment the article
  comment : [{
    type : Schema.Types.ObjectId,
    ref : "Comment"
  }]
} ,  { timestamps: true });




// userSchema.pre("save", async function (next) {
//   try {
//     let salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();

//   } catch (error) {
//     next(error);
//   }
// })



var Article = mongoose.model("Article" , articleSchema);

module.exports = Article;
