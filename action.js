/**
 * Created by jonathanc on 10/9/15.
 */

/**
 * Document approval Schema
 */



var Data = require('./dataschema');

// Token
var token = function() {
    var finalToken = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/x/g, function()
        {
            return (Math.random()*16|0).toString(16)
        }).replace(/y/, function(){
            var hex = ['8', '9', 'a', 'b'];
            return hex[(Math.random() * (hex.length - 0) + 0|0)]
        })
    return finalToken
    };



// Action
var Action = function(app) {

};

Action.prototype.getSchema = function() {
    return Data;
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

    return {token:newData.token,
            stuff:stuff  };
};

Action.prototype.get_data = function(token) {
    Data.find({token:token})
};

module.exports = Action;
