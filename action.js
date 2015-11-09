var Data = require('./dataschema');
var util = require('util');
var uuid = require('node-uuid');

// Action
var Action = function(app) {

};

Action.prototype.getSchema = function() {
    return Data;
};

Action.prototype.createNewToken = function(stuff) {
     var newData = new Data({
        token: uuid.v4(),
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

Action.prototype.getData = function(token, callback) {
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

Action.prototype.getAllData = function(sessionId, callback) {
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
Action.prototype.deleteData = function(token, callback) {
	var deletedMessage = "Data deleted!"
	this.getData(token, function(data){
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
