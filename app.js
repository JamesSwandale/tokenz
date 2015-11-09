var express = require("express");
var logger = require("morgan");
var Action =  require('./action');
var app = express();
var util = require('util');
var bodyParser = require('body-parser')
var tokenParamsValidation = require('./tokens/api/parameterizers').create;

app.listen(3000, function() {
    util.log("App started on port 3000");
});

app.action = new Action(app);
app.use(bodyParser.json())

app.post("/v1/tokens.json", function(req, res) {
    var response = app.action.createNewToken(req.body)
	    res.type("json");
	    res.status(201).send(response);
});

app.get("/v1/tokens.json", function(req, res) {
    var response = app.action.getAllData(req.query.sessionId, function(data) {
        res.type("json");
        res.status(200).send(data);
    });
});

app.get("/v1/tokens.json/:token", function(req, res) {
    var response = app.action.getData(req.params.token, function(data) {
        res.type("json");
        res.status(200).send(data);
    });
});

app.delete("/v1/tokens.json/:token", function(req, res) {
    var response = app.action.deleteData(req.params.token, function(data){
    	res.type("string");
    	res.status(200).send(response);
    });
});

module.exports = app;