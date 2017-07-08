//MongoDB native driver
//var dbconn = require('../data/dbconnection.js');
//Mongo objectID utility
//var ObjectId = require('mongodb').ObjectId;
//var hotelData = require('../data/hotel-data.json');

//Mongoose
var mongoose = require('mongoose');
//Hotel database model
var Hotel = mongoose.model('Hotel');

/*Geo-coordinates query*/
var runGeoQuery = function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);

    if (isNaN(lng) || isNaN(lat)) {
        res
            .status(400)
            .json({
                "message" : "If supplied in querystring Latitude and Longitude should be numbers"
            });
        return;
    }

    //A geoJSON point
    var point = {
        type : "Point",
        coordinates : [lng, lat]
    };

    var geoOptions = {
        spherical : true,
        maxDistance : 2000,
        num : 5
    };

    Hotel
        .geoNear(point, geoOptions, function(err, results, stats) {
            console.log('Geo results', results);
            console.log('Geo stats', stats);
            res
                .status(200)
                .json(results);
        });
};

module.exports.hotelsGetAll = function(req, res) {

    /*Latitude and Longitude url query parameter*/
    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
        }

    /*Pagination*/
    //Set offset and count default values to get subsets of data
    var offset = 0;
    var count = 5;
    var maxCount = 100;

    if (req.query && req.query.offset) {
        //Extract values from query string
        offset = parseInt(req.query.offset, 10);
    }

    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
    }

    if (isNaN(offset) || isNaN(count)) {
        res
            .status(400)
            .json({
                "message" : "If supplied in querystring count and offset should be numbers"
            });
        return;
    }

    if (count > maxCount) {
        res
            .status(400)
            .json({
                "message" : "Count limit of " + maxCount + " exceeded"
            });
        return;
    }

    Hotel
        .find()
        .skip(offset)
        .limit(count)
        .exec(function(err, hotels) {
            if (err) {
                console.log("Error finding hotels");
                res
                    .status(500)
                    .json(err);
            } else {
            console.log("Found hotels", hotels.length);
            res
                .json(hotels);
            }
        });
};

module.exports.hotelsGetOne = function(req, res) {
	//URL parameter as location index on hotel data json object array
	//URL request parameter extract hotelId
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

    Hotel
        .findById(hotelId)
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found"
                };
            }
            res
                .status(response.status)
                .json(response.message);
        });
};

//Convert string delimited by semi-colon to an array of strings
var _splitArray = function(input) {
    var output;
    if (input && input.length > 0) {
        output = input.split(";");
    } else {
        output = [];
    }
    return output;
};

module.exports.hotelsAddOne = function(req, res) {

    Hotel
    //Create object will contain data to be added and a callback function
    //Callback function takes error and document to be returned
        .create({
            //Object is key value pair
            //Key is name of path in mongoose
            //Value is the value we want to store in the document
            name : req.body.name,
            description : req.body.description,
            //Pre-processing
            stars : parseInt(req.body.stars, 10),
            services : _splitArray(req.body.services),
            photos : _splitArray(req.body.photos),
            currency : req.body.currency,
            location : {
                address : req.body.address,
                coordinates : [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
                ]
            }
        }, function (err, hotel) {
            if (err) {
                console.log("Error creating hotel");
                res
                    .status(400)
                    .json(hotel);
            } else {
                console.log("Hotel created", hotel);
                res
                    .status(201)
                    .json(hotel);
            }
        });
};

module.exports.hotelsUpdateOne = function(req, res) {
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);

    Hotel
        .findById(hotelId)
        //Exclude subdocuments
        .select("-reviews -rooms")
        .exec(function(err, doc) {
            var response = {
                status : 200,
                message : doc
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found"
                };
            }
            if (response.status !== 200) {
            res
                .status(response.status)
                .json(response.message);
            } else {
                //Update data in model instance
                //doc object will be a mongoose model instance of the document
                doc.name = req.body.name;
                doc.description = req.body.description;
                doc.stars = parseInt(req.body.stars, 10);
                doc.services = _splitArray(req.body.services);
                doc.photos = _splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.location = {
                    address : req.body.address,
                    coordinates : [
                    parseFloat(req.body.lng),
                    parseFloat(req.body.lat)
                    ]
                };

                doc.save(function(err, hotelUpdated) {
                    if(err) {
                        res
                            .status(500)
                            .json(err);
                    } else {
                        res
                            .status(204)
                            .json();
                    }
                });
            }
        });
};

module.exports.hotelsDeleteOne = function(req, res) {
    var hotelId = req.params.hotelId;

    Hotel
        .findByIdAndRemove(hotelId)
        .exec(function(err, hotel) {
            if (err) {
                res
                    .status(404)
                    .json(err);
            } else {
                console.log("Hotel deleted, id: ", hotelId);
                res
                    .status(204)
                    .json();
            }
        });
};





