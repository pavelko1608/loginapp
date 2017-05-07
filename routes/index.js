var express = require('express');
var mongoose = require("mongoose");
var router = express.Router();

var Post = require("../models/post");
var db = require("../db");

// GET home page. 
router.get("/", ensureAuthenticated, function(req,res) {
	collection = db.collection('posts');
	collection.find().toArray(function(err, post) {
		res.render("index", {posts: post.reverse()});
	});
	
});
router.get("/posts/create", ensureAuthenticated, function(req, res) {
	res.render("createPost");
});
router.post("/posts/create", ensureAuthenticated, function(req, res) {
	 var newPost = new Post({
	 	title: req.body.title,
	 	post: req.body.post,
	 	username: req.user.name,
	 	oauth_provider: req.user.oauth_provider
	});

	req.checkBody("title", "Title is required").notEmpty();
	req.checkBody("post", "Your post is empty").notEmpty();

	var errors = req.validationErrors();

	if(errors) {
		res.render("createPost", {
			errors: errors
		});
	} else {
		newPost.save();
		console.log(newPost);
		res.redirect("/");
	}

});
router.get("/deletePost/:id", ensureAuthenticated, function(req, res) {
	Post.findOne({_id: req.params.id}, function(err, post) {
		if(post.username == req.user.name) {
			post.remove();
		} else {
			res.send("Bloddy hacker!!");
		}

	});
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		//req.flash("error_msg", "You are not logged in");
		res.redirect("/users/login");
	}
}



module.exports = router;
