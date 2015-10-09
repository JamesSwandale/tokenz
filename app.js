var express = require("express");
var logger = require("morgan");
var Action =  require('./action');
var app = express();

app.use( logger("short") );


app.listen(3000, function() {
    console.log("App started on port 3000");
});

app.action = new Action(app);


//{
//    create_new_token: function(stuff) {
//        console.log(stuff);
//    }
//}

app.post("/v1/tokens", function(req, res) {
    var response = app.action.create_new_token("somestuff");
    res.type("json");
    res.status(201).send(response);
//    res.body(response);
});

// Export the app for testing
module.exports = app;