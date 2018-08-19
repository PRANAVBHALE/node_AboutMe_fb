var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var config = require("./config/config");

var FacebookStrategy = require("passport-facebook");

var mongo = require("mongodb");
var mongoose = require("mongoose");

//mongoose.connect('mongodb://localhost/mongo-data-login-reg')
//mongoose.Promise = global.Promise
//var db = mongoose.connection

let db = {
  localhost: "mongodb://localhost:27017/mongo-data-twiter_app"
  // mlab: 'mongodb://pranav:bhale@ds239988.mlab.com:39988/loginapp'
};

mongoose.Promise = global.Promise;
mongoose.connect(
  db.localhost,
  { useMongoClient: true }
);

//#Routes
var routes = require("./routes/index");
var users = require("./routes/users");
var fb = require("./routes/fb");

var User = require("./models/user.js");
//var FbUser = require("./models/fbuser.js")

//console.log(users);
console.log(fb);

var app = express();

//express-handlebars configs
app.set("views", path.join(__dirname, "views"));
app.engine("handlebars", exphbs({ defaultLayout: "layouts" }));
app.set("view engine", "handlebars");

//bodyParser configs
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//static folder
app.use(express.static(path.join(__dirname, "public")));

// session configs
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
    //cookie: { secure: true }
  })
);

//passport config
app.use(passport.initialize());

app.use(passport.session());

//express Validatior

//Flash config
debugger;
app.use(flash());

app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

//facebook

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebookAuth.clientID,
      clientSecret: config.facebookAuth.clientSecret,
      callbackURL: config.facebookAuth.callbackURL,
      profileFields: ["id", "displayName", "email","feed","likes","favorite_athletes","movies"]
    },
    function(accessToken, refreshToken, profile, done) {
      debugger
      process.nextTick(function() {
        User.findOne({ email: profile.emails[0].value }, function(err, user) {
          //  return cb(err, user);
          if (err) {
            return done(err);
          }

          //debugger

          if (user) {
            return done(null, user);
          } else {
           // console.log('profile --->>>' + profile);
            debugger
            var user = new User();
            user.facebook.name = profile.displayName;
            user.facebook.token = accessToken;
            //req.session.token = accessToken
            user.facebook.email = profile.emails[0].value;
            user.facebook.id = profile.id;
            user.facebook.likes = profile._json.likes
            user.facebook.movies = profile._json.movies
            user.facebook.favorite_athletes = profile._json.favorite_athletes
            user.facebook.feed = profile._json.feed
           

            user.save(function(err) {
              console.log(err);

              if (err) throw err;

              return done(null, user);
            });
          }
        });
      });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    if (err || !user) return done(err, null);
    done(null, user);
  });
});

app.use("/", routes);
app.use("/users", users);
app.use("/", fb);

// app.get('/',(req,res)=>{
//   res.send('Hello')
// })

var port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is hosted on ${port}`);
});
