var express = require('express');
var passport = require('passport');
var User = require('../models/users');
var router = express.Router();


router.get('/', function(req, res){

    if(req.session.passport != undefined)
        res.redirect('/user/feed');

    else{
         res.render("homepage/index", {home : true, loginButton: true, signupButton: true});
    }
})

router.get('/login', function(req, res){
    var messages = req.flash('error')
    console.log(messages);
    res.render("homepage/login", {messages : messages , hasError: messages.length > 0, home : false, 
        loginButton: false, signupButton: true, signoutButton: false});
})

router.get('/signup', function(req, res){
    var messages = req.flash('error')
    var userCreation = req.session.passport
    if(userCreation != undefined){
        res.render("homepage/signup", {messages : ["Account Successfully created"] , hasError: 1, isUserCreation : 1 ,home: false, 
        loginButton: true, signupButton: false, signoutButton: false});
    }
    else
    {
        res.render("homepage/signup", {messages : messages , hasError: messages.length > 0, isSignUp: 1 ,home: false, 
        loginButton: true, signupButton: false, signoutButton: false});
    }
})


router.get('/signout', function(req, res){
    req.session.destroy();
    req.logOut();
    res.redirect('/');
})

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect : '/signup',
    failureRedirect : '/signup',
    successFlash : 'User created Successfully',
    failureFlash : true
}))

router.post('/login', passport.authenticate('local.signin',{
   successRedirect : '/user/feed',
   failureRedirect : '/login',
   failureFlash : true
}))


module.exports = router;