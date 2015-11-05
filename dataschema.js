var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/data_test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {});

var DataSchema = new Schema({
    token: {
        type:String,
        trim: true,
        unique:false,
        required:true
    },
    content:{
        type:Object,
        trim: true,
        unique:false,
        required:true
    },
    type: {
        type:String,
        trim: true,
        unique:false,
        required:true
    },
    userSession: {
        type:String,
        trim: true,
        unique:false,
        required:true
    },
    expired_at: Date,
    created_at: Date
});

module.exports = mongoose.model('Data', DataSchema);
