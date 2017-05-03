var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
const RedisStore = require('connect-redis')(session);
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("mongodb");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/loginapp");
var db = mongoose.connection;

var routes = require("./routes/index");
var users = require("./routes/users");

//INIT APP
var app = express();

//VIEW ENGINE
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

//BODYPARSER MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//EXPRESS SESSION
app.use(session({
	store: new RedisStore(),
	secret: "i love dogs",
	saveUninitialized: true,
	resave: true
}));

//PASSPORT INIT
app.use(passport.initialize());
app.use(passport.session());

//EXPRESS VALIDATOR
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split(".")
		, root   = namespace.shift()
		, formParam = root;

		while(namespace.length) {
			formParam += "[" + namespace.shift() + "]";
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//CONNECT FLASH
app.use(flash());

//GLOBAL VARIABLES
app.use(function(req, res, next) {
	res.locals.success_msg = req.flash("success_msg");
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.user = req.user || null;
	next();
});

app.use("/", routes);
app.use("/users", users);

//SET PORT
app.set("port", (process.env.PORT || 3000));

app.listen(app.get("port"), function() {
	console.log("Server started on port" + app.get("port"));
})


































