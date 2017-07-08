/*Mongoose*/
//Mongoose object doesnt have a callback, will listen to events to see when a connection is made
var mongoose = require('mongoose');
var dburl = 'mongodb://localhost:27017/meanhotel';

mongoose.connect(dburl);

/*Event listeners*/
//Start connection
mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dburl);
});
//Disconnected connection
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});
//Connection error trapping
mongoose.connection.on('error', function(err){
	console.log('Mongoose connection error: ' + err);
});

/* Capture Termination and Restart events*/
// For app termination command ctrl c
process.on('SIGINT', function() {
	mongoose.connection.close(function() {
		console.log('Mongose disconnected through app terminiation (SIGINT)');
		process.exit(0);
	});
});

// For nodemon restarts
process.on('SIGTERM', function() {
	mongoose.connection.close(function() {
		console.log('Mongose disconnected through app terminiation (SIGTERM)');
		process.exit(0);
	});
});

// For Heroku app termination
process.once('SIGTERM', function() {
	mongoose.connection.close(function() {
		console.log('Mongose disconnected through app terminiation (SIGTERM)');
		process.kill(proecss.pid, 'SIGUSR2');
	});
});

//Require Schemas and Models
require('./hotels.model.js');

