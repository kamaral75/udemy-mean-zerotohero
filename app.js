//MongoDB driver
//require('./api/data/dbconnection.js')._open();
//Mongoose driver
require('./api/data/db.js');
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

var routes = require('./api/routes');

app.set('port', 3000);

app.use(function (req, res, next) {
    console.log(req.method, req.url);
    next();
});

//Public/index.html
app.use(express.static(path.join(__dirname, 'public')));

//Middleware module to handle form POST request
app.use(bodyParser.urlencoded({ extended : false }));

app.use('/api', routes);

var server = app.listen(app.get('port'), function() {
    var port = server.address().port;
    console.log('Magic happens on port ' + port);
});