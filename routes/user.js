var express = require('express');
var passport = require('passport');
var multer = require('multer');
var router = express.Router();
var posts = require('../models/posts.js')
var user = require('../models/users')
var gcs = require('@google-cloud/storage');
var format = require('util').format;
var userId;
var userName;
var fileName;

const storage = gcs({
    keyFilename : __dirname + '/../practise-key.json'
})

const bucket = storage.bucket('demo-for-practise')

var createNewPost = function(url, postText){
    var newpost = posts();
    newpost.photo_url =  url;
    newpost.uploadedBy = userName;
    newpost.uploadedBy_Id = userId;
    newpost.date = Date.now();
    newpost.posttext = postText;

    newpost.save((err, docs) =>{
        if(err)
            throw err;
        else
            console.log(docs);
    })
}

var upload = multer({storage : multer.memoryStorage()}).single('userPhoto');

router.get('/feed', function(req, res){

    if(req.session.passport == undefined)
        res.redirect('/');
    else{

     posts.find().sort({date:-1}).find(function(err, docs){
          res.render("user/feed.hbs", { home : false, 
        loginButton: false, signupButton: false, signoutButton: true, isLoggedin : true, posts: docs});
      })
    }


    if(req.session.passport.user != undefined){
        userId = req.session.passport.user;

        user.findById(userId, function(err, docs){
            if(err)
                console.log(err)
            else
            {
                userName = docs['firstname'] +' '+ docs['lastname'];
            }
        })
    }
 

})

router.get('/myphotos', function(req, res){
    if(req.session.passport == undefined)
            res.redirect('/');
    else{

        var userId = req.session.passport.user;
    
        posts.find({uploadedBy_Id : userId}, function(err, docs){
            
            var postChunks = [];
            const chunkSize = 3;

            for(var i=0; i<docs.length; i = i+chunkSize)
            {
                postChunks.push(docs.slice(i, i+chunkSize));
            }


            res.render("user/myphotos.hbs", { home : false, 
            loginButton: false, signupButton: false, signoutButton: true, isLoggedin : true, photos: postChunks});  
        })
    }
})

router.post('/feed/feedPost', function(req, res){
    upload(req, res, function(err){
        if(err){
            // console.log(err);
            console.log(err);
            return res.end(err);
        }
        
        var newpost =  posts();
        // newpost.photo_url = 'http://localhost:3000/image/'+fileName;
        newpost.photo_url = 'https://supergram.herokuapp.com/image/'+fileName;
        newpost.uploadedBy = userName;
        newpost.uploadedBy_Id = userId;
        newpost.date = Date.now();
        newpost.posttext = req.body.posttext;

        newpost.save(function(err, post){
            if(err)
                throw err;
            else
                console.log(post);
        })

        res.redirect('/user/feed');        
    })
})


router.post('/feed/feedGCS', upload, function(req, res, next){
    if(!req.file){
        res.status(400).send("No file uploaded");
        return;
    }

  const blob = bucket.file(req.file.originalname);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    next(err);
  });

  blobStream.on('finish', () => {
    const publicUrl = format(`https://storage.googleapis.com/${bucket.name}/${blob.name}`);
    
        bucket.file(req.file.originalname).getSignedUrl({
            action : 'read',
            expires : Date.now()+ Date.now(),
        }, (err, url) =>{
            if(err)
            {
                console.log(err);
                res.status(400).send("Error");
            }
            else{
                console.log(url);
                res.redirect('/user/feed')
                createNewPost(url, req.body.posttext);
            }
        })

});


  blobStream.end(req.file.buffer);



})

module.exports = router