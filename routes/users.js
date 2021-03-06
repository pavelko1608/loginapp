var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
var GitHubStrategy = require("passport-github2").Strategy;
var mongoose = require("mongoose");

var User = require("../models/user");
var db = require("../db");


//LOCAL STRATEGY
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUsername(username, function(err, user) {
			if(err) throw err;
			if(!user) {
				return done(null, false, {message: "Unknown User"});
			} 
		
		User.comparePassword(password, user.password, function(err, isMatch) {
			if(err) throw err;
			if(isMatch) {
				return done(null, user);
			} else {
				return done(null, false, {message: "Invalid password"});
			}			
		});
		});
	}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});

//FACEBOOK STRATEGY
passport.use(new FacebookStrategy({
    clientID: "404285189927690",
    clientSecret: "8924399b0f5e60f180032049a6052997",
    callbackURL: 'http://46.101.234.118/users/auth/facebook/callback'
  },
  function(accessToken, refreshToken, profile, done) {
  	User.findOne({ "oauth_provider": "facebook", 'oauth_id' : profile.id }, function(err, user) {
  		console.log(user);
  		if (err) {
          return done(err);
  		}
  		if (user) {
  			return done(null, user); 
  		} else {
  			var newUser = new User();
  			newUser.name = profile.displayName;
  			newUser.oauth_provider = "facebook";
  			newUser.oauth_id = profile.id;


 			User.createUser(newUser, function(err) {
                        if (err) {
                            throw err;
                        }
                       // if successful, return the new user
                        return done(null, newUser);
                    });
 		}
 	});
  }));

//GITHUB STRATEGY
passport.use(new GitHubStrategy({
    clientID: "b3da5009c2a93cbbc34f",
    clientSecret: "8bbb3d5f938a59a8033ed095d4cdd0ffb7ab5477",
    callbackURL: "http://46.101.234.118/users/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
  	console.log(profile);
  	User.findOne({ "oauth_provider": "github", 'oauth_id' : profile.id }, function(err, user) {

  		if (err) {
          return done(err);
  		}
  		if (user) {
  			return done(null, user); 
  		} else {
  			var newUser = new User();
  			newUser.name = profile.displayName;
  			newUser.oauth_provider = "github";
  			newUser.oauth_id = profile.id;


 			User.createUser(newUser, function(err) {
                        if (err) {
                            throw err;
                        }
                       // if successful, return the new user
                        return done(null, newUser);
                    });
 		}
   
  }
);
  }));

//REGISTER
router.get("/register", function(req, res) {
	res.render("register");
});

//REGISTER USER
router.post("/register", function(req, res) {
	collection = db.collection('users');

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	//VALIDATION
	req.checkBody("name", "Name is required").notEmpty();
	req.checkBody("email", "Email is required").notEmpty();
	req.checkBody("email", "Email is not valid").isEmail();
	req.checkBody("username", "Username is required").notEmpty();
	req.checkBody("password", "Password is required").notEmpty();
	req.checkBody("password2", "Passwords do not match").equals(req.body.password);
	
	var errors = req.validationErrors();

	if(errors) {
		res.render("register", {
			errors: errors
		});
	} 
	
	collection.find({username: username}).toArray((err, user) => {
		if(user.length) {
			console.log(user);
			res.render("register", {warning: "User with these credentials already exists"})
		} else { 
			collection.find({email: email}).toArray((err, user) => {
				if(user.length) {
					console.log(user);
					res.render("register", {warning: "User with these credentials already exists"})
				} else {
						var newUser = new User({
							name: name,
							email: email,
							username: username,
							password: password
						});
						//MAKE SEPARATE VALIDATIONS FOR USERNAME AND EMAIL!!!!(FIXED)
						User.createUser(newUser, function(err, user) {
							if(err) throw err;
							console.log(user);
						});
						req.flash("success_msg", "You are registered and can now login");
						res.redirect("/users/login");
					}
					});
				}
		});
	});


//LOGIN
router.get("/login", function(req, res) {
	res.render("login");
});

//LOGIN USER
router.post("/login",
	passport.authenticate("local", { successRedirect: "/", failureRedirect: "/users/login", failureFlash: true}),
	function(req, res) {
		res.redirect("/");
	});

//FACEBOOK LOGIN
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect("/");
  });

//GITHUB LOGIN
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect("/");
  });


//LOGOUT USER
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/users/login");
});

module.exports = router;






















