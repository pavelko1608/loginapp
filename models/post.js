var mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;
var connection = mongoose.createConnection("mongodb://localhost/loginapp");
autoIncrement.initialize(connection);


//POST SCHEMA
var PostSchema = mongoose.Schema({
	id: { 
		type: Schema.Types.ObjectId, 
		ref: 'Post' 
	},
	title: {
		type: String	
	},
	post: {
		type: String
	},
	username: {
		type: String
	},
	oauth_provider: {
		type: String
	}
});
PostSchema.plugin(autoIncrement.plugin, 'Post');
var Post = module.exports = mongoose.model("Post", PostSchema);