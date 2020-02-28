var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcryptjs");

var userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    match: /^\S+@\S+$/,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String
  },
  token: {
    type: String
  },
  bio: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: null
  },
  following: {
    type: Boolean,
    default: false
  },
  article : {
    type : Schema.Types.ObjectId,
    ref : "Article"
  }
});

userSchema.pre("save", async function (next) {
  try {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();

  } catch (error) {
    next(error);
  }
})

userSchema.methods.verifyPassword = async function (password, next) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    next(error);
  }
}


var User = mongoose.model("User", userSchema);

module.exports = User;

