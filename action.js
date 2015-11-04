var Data = require('./dataschema');
var util = require('util');


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
        created_at: new Date(),
        userSession: "123456",
        type: "nonsense"
    });

    util.log("New data with token: " + newData.token);

    newData.save(function(err, res){
        if (err) {
            util.log(err);
//            res.sendStatus(500);
        } else {
            //exports.sendPushNotification(newData,'Create', req);
            //res.status(201).json(newApproval);
        }
    });

    return {token:newData.token,
            stuff:stuff  };
};

Action.prototype.get_data = function(token, callback) {
    Data.findOne({"token":token})
        .exec( function(err, data) {
            if (err || data == null) {
                util.log(err + " get errrroorrrrrr");
                return callback({});
            } else {
                callback(data.toObject());
            }
        });
};

Action.prototype.get_all_data = function(sessionId, callback) {
    Data.find({"userSession":sessionId})
        .exec( function(err, data) {
            if (err || data == null) {
                util.log(err + " get all errrroorrrrrr");
                return callback([{}]);
            } else {
                callback(data);
            }
        });
};
Action.prototype.delete_data = function(token, callback) {
	var deletedMessage = "Data deleted!"
	this.get_data(token, function(data){
		Data.findOneAndRemove({token:token})
	        .exec( function(err, data2) {
	            if (err) {
	                util.log(err + " delete errrroorrrrrr");
	                //res.send(500);
	            } else {
	    		Data.findOne({"token":token})
	            }
	        });
	    callback(data)
	})

};


module.exports = Action;
