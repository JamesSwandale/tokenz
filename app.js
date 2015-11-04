var express = require("express");
var logger = require("morgan");
var Action =  require('./action');
var app = express();
var util = require('util');
var bodyParser = require('body-parser')
var tokenParamsValidation = require('./tokens/api/parameterizers').create;

//app.use(logger("dev"));

util.log = function() {}


app.listen(3000, function() {
    util.log("App started on port 3000");
});

app.action = new Action(app);
app.use(bodyParser.json())

app.post("/v1/tokens.json", function(req, res) {
	util.log("Request: POST " + util.inspect(req.body, false, null));
    var response = app.action.create_new_token(req.body)
	    res.type("json");
	    res.status(201).send(response);
});

app.get("/v1/tokens.json", function(req, res) {
    util.log("Request GET ALL : " + util.inspect(req.query.sessionId, false, null));
    var response = app.action.get_all_data(req.query.sessionId, function(data) {
        res.type("json");
        res.status(200).send(data);
    });
});

app.get("/v1/tokens.json/:token", function(req, res) {
    util.log("Request GET: " + util.inspect(req.params.token, false, null));
    var response = app.action.get_data(req.params.token, function(data) {
        res.type("json");
        res.status(200).send(data);

    });
});

app.delete("/v1/tokens.json/:token", function(req, res) {
	util.log("Request: DELETE " + util.inspect(req.params.token, false, null));
    var response = app.action.delete_data(req.params.token, function(data){
    	res.type("string");
    	res.status(200).send(response);
    });
});


// Export the app for testing
module.exports = app;