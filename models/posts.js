var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var postSchema = Schema({
    photo_url : {type: String, required: true},
    uploadedBy : {type : String, required: true},
    uploadedBy_Id : {type: String, required: true},
    date : {type: Date, required : true},
    posttext: {type: String}
});


module.exports = mongoose.model('Post', postSchema);