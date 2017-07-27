var express = require('express');
var passport = require('passport');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var flash = require('connect-flash')
var session = require('express-session')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan')

var index = require('./routes/index')
var user = require('./routes/user')
mongoose.connect("mongodb://dinesh10c04:3158233Dinesh@ds125113.mlab.com:25113/photogram")
// mongoose.connect("localhost:27017/photo-uploader")
require('./config/passport');

var app = express();
var port  = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.engine('.hbs', expressHbs({defaultLayout : 'layout', extname:'.hbs'}))
app.set('view engine', '.hbs')
app.use(session({secret: 'dineshadhitya', saveUninitialized: false, resave:false}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())

app.listen(port, function(){
    console.log("Listening to " + port);
})

app.use('/', index);
app.use('/user', user);

app.get('/image/:id', function(req, res){
    var id = req.params.id;

    res.sendFile('./uploads/'+id, {'root': __dirname});
})

module.exports = app;