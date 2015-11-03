var express = require("express");
var logger = require("morgan");
var Action =  require('./action');
var app = express();
var util = require('util');
var bodyParser = require('body-parser')

app.use( logger("short") );


app.listen(3000, function() {
    console.log("App started on port 3000");
});

app.action = new Action(app);
app.use(bodyParser.json())


//{
//    create_new_token: function(stuff) {
//        console.log(stuff);
//    }
//}



app.post("/v1/tokens", function(req, res) {
	console.log("Request: POST " + util.inspect(req.body, false, null));
    var response = app.action.create_new_token(req.body)
	    res.type("json");
	    res.status(201).send(response);
});

app.get("/v1/tokens/:token", function(req, res) {
    console.log("Request GET: " + util.inspect(req.params.token, false, null));
    var response = app.action.get_data(req.params.token, function(data) {
        res.type("json");
        res.status(200).send(data);

    });
});

app.delete("/v1/tokens/delete/:token", function(req, res) {
	console.log("Request: DELETE " + util.inspect(req.params.token, false, null));
    var response = app.action.delete_data(req.params.token, function(data){
    	res.type("string");
    	res.status(200).send(response);    	
    });
});


// Export the app for testing
module.exports = app;