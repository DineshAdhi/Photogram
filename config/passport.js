var passport = require('passport');
var User = require('../models/users')
var LocalStrategy = require('passport-local').Strategy;
var cheerio = require('cheerio')

const $ = cheerio.load('../views/homepage/signup.hbs')

passport.serializeUser(function(user, done){
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user)
    })
});

passport.use('local.signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback: true,
}, function(req, email, password, done){



    User.findOne({'email': email}, function(err, user){
        
        if(err)
            return done(err)
        if(user)
            return done(null, false, {message : "User with the email already exists"});



        var newUser = User();
        newUser.firstname = req.body.firstname
        newUser.lastname = req.body.lastname;
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save(function(err, user){
            if(err)
                return done(err);
            
            return done(null, user);
        })

    })

}))


passport.use('local.signin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true,
}, function(req, email, password, done){


    User.findOne({email : email}, function(err, user){
        if(err)
            return done(err)
        if(!user)
            return done(null, false, {message: "Incorrect Email"});
        if(!user.validPassword(password))
            return done(null, false, {message : "Your password is incorrect"});

        return done(null, user);
    })
}))


