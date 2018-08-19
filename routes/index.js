var express = require('express');
var router = express.Router()

//#home
router.get('/', ensureAuthenticated,function (req,res) {
  res.render('index')
})

function ensureAuthenticated(req,res,next) {
  debugger
  if(req.isAuthenticated()){
    return next();
  }else{
    //req.flash('error_msg','Your are not looged in')
    res.redirect('/users/login')
  }
}

module.exports = router
