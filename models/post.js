var mongoose = require("mongoose");

//USER SCHEMA
var PostSchema = mongoose.Schema({
	title: {
		type: String	
	},
	post: {
		type: String
	},
	username: {
		type: String
	}
	
});

var Post = module.exports = mongoose.model("Post", PostSchema);