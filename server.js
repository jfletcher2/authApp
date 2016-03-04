// server.js

// set up ======================================================================
// get all the tools we need
var express         = require('express');
var app             = express();
var port            = process.env.PORT || 3000;
var mysql           = require('mysql');
var connection    = require('express-myconnection')
var passport        = require('passport');
var flash           = require('connect-flash');
var debug           = require('debug')('authApp:server')
var morgan          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');
var configDB        = require('./config/database.js');

// configuration ===============================================================
// connect to our database
app.use(connection(mysql, configDB, 'single'));
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('view engine', 'jade'); // set up ejs for templating
app.use("/css", express.static(__dirname + '/views/css'));
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
//app.listen(port);
//console.log('The magic happens on port ' + port);
app.listen(port, function() {
  debug('server listening on port ' + port);
});
