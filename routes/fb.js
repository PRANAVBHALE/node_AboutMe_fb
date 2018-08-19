var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
//var ensureAuthenticated = require("./index");

//debugger;

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// GET /auth/facebook/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  function(err, user, info) {
    debugger;
    // Successful authentication, redirect home.
    console.log(req.body);
    res.redirect("/");
  }
);

router.get("/getMovies", (req, res, next) => {
  var reqToken = req.headers.token;

  User.findOne(
    {
      "facebook.token": reqToken
    },
    (err, user) => {
      // console.log('1111 - >',user);

      if (!user) {
        res.json({ msg: "UnAuthuried User" });
      } else {
        var movies = user.facebook.movies.data;
        res.json({ movies: movies });
      }
    }
  );
});

router.get("/getFeeds", (req, res, next) => {
  var reqToken = req.headers.token;

  //console.log(req.header)
  User.findOne(
    {
      "facebook.token": reqToken
    },
    (err, user) => {
      // console.log('1111 - >',user);

      if (!user) {
        res.json({ msg: "UnAuthuried User" });
      } else {
        var feeds = user.facebook.feed.data;
        res.json({ feeds: feeds });
      }
    }
  );
});

router.get("/getLikes", (req, res, next) => {
  var reqToken = req.headers.token;

  //console.log(req.header)
  User.findOne(
    {
      "facebook.token": reqToken
    },
    (err, user) => {
      // console.log('1111 - >',user);

      if (!user) {
        res.json({ msg: "UnAuthuried User" });
      } else {
        var likes = user.facebook.likes;

        // console.log(likes);

        res.json({ likes: likes });
      }
    }
  );
});

router.get("/getPlayers", (req, res, next) => {

  var reqToken = req.headers.token;


  User.findOne(
    {
      "facebook.token": reqToken
    },
    (err, user) => {
      // console.log('1111 - >',user);

      if (!user) {
        res.json({ msg: "UnAuthuried User" });
      } else {
        var players = user.facebook.favorite_athletes;

        //  var players = user.facebook.favorite_athletes

        res.json({ players: players });
      }
    }
  );
});
module.exports = router;
