var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    likes:Array,
    feed:Object,
    movies:Object,
    favorite_athletes:Object
  }
});

//UserSchema.plugin(passportLocalMongoose)

var User = (module.exports = mongoose.model("User", UserSchema));
