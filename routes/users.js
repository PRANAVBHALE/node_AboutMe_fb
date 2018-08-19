var express = require('express');
var router = express.Router()
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook')


var User = require("../models/user")



//#Resgister
router.get('/register',function (req,res) {
  res.render('register')
})


//#login
router.get('/login',function (req,res) {
  res.render('login')
  console.log(req);
})


  // passport.serializeUser(function(user, done) {
  //   done(null, user.id);
  // });
   
  // passport.deserializeUser(function(id, done) {
  //   User.findById(id, function (err, user) {
  //     done(err, user);
  //   });
  // });

//Login page button data

router.post('/login',
  passport.authenticate('facebook',{
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash:true
  }),
  function(req, res) {

    res.redirect('/');
  });

  router.get('/logout',function(req,res){
    req.logout()

    req.flash('success_msg','You have logged out')

    res.redirect('/users/login')
  })

module.exports = router
