var user = require('./models/users')
var mongoose = require('mongoose');

mongoose.connect("localhost:27017/photo-uploader")

var newUser = new user({
    firstname : "dinesj",
    lastname : "asdf",
    email   : "asdf",
    password  : "asdf"
})

newUser.save(function(err, user){
    if(err)
       console.log(err);
    
    console.log("Saved");
    console.log(user);
})