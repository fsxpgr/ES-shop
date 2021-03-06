const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
var controllers = require('./controllers');
const mongoose = require('mongoose');
const passport = require('passport');
var favicon = require('serve-favicon')
const bcrypt = require ('bcrypt')
const LocalStrategy = require('passport-local').Strategy;

var app = express();

app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({
	extended: true
}));


app.use(favicon(path.join(__dirname, 'favicon.png')))
//use passport
app.use(require('express-session')({
	secret: 'secretforsession',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// configure passport
const User = require('./dbSchemas/user');


//
passport.use(new LocalStrategy(
	{usernameField:"email", passwordField:"password"},
  	function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) {console.log('error in findone',err); return done(err); }
	  if (!user) { console.log("not user found");return done(null, false); }
	//   bcrypt password here
	  bcrypt.compare( password, user.password, (err, res)=>{
			if(err) return done(err);
			if(res === false) {
				return done(null,false)
			}else{
				return done(null, user)
			}
	  } )
    //   return done(null, user);
    });
  }
));
//

passport.serializeUser(
	(User, done) => {
		done(null, User.id);
	}
);

passport.deserializeUser(
	(id, done) => {
		User.findById(id, (err, User) => {
			done(err, User);
		});
	}
);

// DB connection
mongoose.connect(config.dbURL, { useMongoClient: true }, console.log("Connected to mongoDB"));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

controllers.set(app);

app.use(express.static('client'));

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/index.html'));
});

module.exports.start = () => app.listen(config.port, () => console.log('App listening on port ' + config.port));
