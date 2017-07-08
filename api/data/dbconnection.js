//Native Mongo driver
var MongoClient = require('mongodb').MongoClient;
var dburl = 'mongodb://localhost:27017/meanhotel';

var _connection = null;

var _open = function() {
	MongoClient.connect(dburl, function(err, db) {
		if (err) {
			console.log("ERROR: Database connection failed!");
			return;
		}
		_connection = db;
		console.log("Database connection open", db);
	});
	//set _connection
};

var _get = function() {
	return _connection;
};

module.exports = {
	_open : _open,
	_get : _get
};