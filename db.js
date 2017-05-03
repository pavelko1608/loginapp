var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;

//DB CONNECTION
mongoose.createConnection("mongodb://localhost/loginapp");
var db = module.exports = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Successfully connected to mongodb!")
});
exports.db = db