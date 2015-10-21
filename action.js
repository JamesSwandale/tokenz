/**
 * Created by jonathanc on 10/9/15.
 */

// Model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/data_test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
});

/**
 * Document approval Schema
 */
var DataSchema = new Schema({
    token: {
        type:String,
        trim: true,
        unique:false,
        required:true
    },
    content:{
        type:String,
        trim: true,
        unique:false,
        required:true
    },
    expired_at: Date,
    created_at: Date
});



var Data = mongoose.model('Data', DataSchema);

// Token
var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var token = function() {
    return rand() + rand(); // to make it longer
};



// Action
var Action = function(app) {

};

Action.prototype.create_new_token = function(stuff) {

     var newData = new Data({
        token: token(),
        content: stuff,
        expired_at: new Date(),
        created_at: new Date()
    });

    console.log("New data with token: " + newData.token);

    newData.save(function(err){
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            //exports.sendPushNotification(newData,'Create', req);
            //res.status(201).json(newApproval);
        }
    });

    return {token:"gibberish",
            stuff:stuff  };
};


module.exports = Action;
