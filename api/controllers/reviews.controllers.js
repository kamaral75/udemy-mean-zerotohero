//Mongoose
var mongoose = require('mongoose');
//Hotel model
var Hotel = mongoose.model('Hotel');

//GET all reviews for a Hotel
module.exports.reviewsGetAll = function(req, res) {
	//URL parameter as location index on hotel data json object array
	//URL request parameter extract hotelId
	var hotelId = req.params.hotelId;
	console.log("GET hotelId", hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc) {
            var response = {
            status : 200,
            message : []
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                console.log("HotelId not found in database", hotelId);
                response.status = 404;
                response.message = {
                    "message" : "HotelId not found " + hotelId
            };
            } else {
                response.message = doc.reviews ? doc.reviews : [];
            }
            res
                .status(response.status)
                .json(response.message);
    });

};

module.exports.reviewsGetOne = function(req, res) {
	//URL parameter as location index on hotel data json object array
	//URL request parameter extract hotelId
	var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
	console.log("GET reviewId: " + reviewId + " for hotelId: " + hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, hotel) {
            var response = {
            status : 200,
            message : {}
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!hotel) {
                console.log("HotelId not found in database", hotelId);
                response.status = 404;
                response.message = {"message" : "Hotel ID not found " + hotelId};
            } else {
            // Get the review
            response.message = hotel.reviews.id(reviewId);
            // If the review doesn't exist Mongoose returns null
            if (!response.message) {
                response.status = 404;
                response.message = {"message" : "Review ID not found " + reviewId};
            }
            }
        res
            .status(response.status)
        .json(response.message);
    });
};

//Subdocuments are objects held in an array
//Reviews array is a property of the hotel document being returned from Mongoose model instance
//Mongoose model instance maps directly to single document in a database
var _addReview = function(req, res, hotel) {
    //hotel is model instance
    hotel.reviews.push({
        name : req.body.name,
        rating : parseInt(req.body.rating, 10),
        review : req.body.review
    });

    hotel.save(function(err, hotelUpdated) {
        if (err) {
            res
                .status(500)
                .json(err);
        } else {
            res
                .status(201)
                .json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
            }
    });
};

//Subdocuments are accessed through their parent document
module.exports.reviewsAddOne = function (req, res) {

    //URL parameter as location index on hotel data json object array
    //URL request parameter extract hotelId
    var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);

    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(err, doc) {
            var response = {
            status : 200,
            message : []
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                console.log("Hotel ID not found in database", hotelId);
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found " + hotelId
            };
            }
            if (doc) {
                _addReview(req, res, doc);
            } else {
                res
                    .status(response.status)
                    .json(response.message);
                }
        });
};

module.exports.reviewsUpdateOne = function (req, res) {
var hotelId = req.params.hotelId;
var reviewId = req.params.reviewId;
console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

    Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
        var thisReview;
        var response = {
        status : 200,
        message : {}
        };
        if (err) {
            console.log("Error finding hotel");
            response.status = 500;
            response.message = err;
        } else if(!hotel) {
            console.log("Hotel id not found in database", hotelId);
            response.status = 404;
            response.message = {"message" : "Hotel ID not found " + hotelId };
        } else {
            // Get the review
            thisReview = hotel.reviews.id(reviewId);
            // If the review doesn't exist Mongoose returns null
            if (!thisReview) {
                response.status = 404;
                response.message = {"message" : "Review ID not found " + reviewId};
            }
        }
        if (response.status !== 200) {
            res
                .status(response.status)
                .json(response.message);
        } else {
            thisReview.name = req.body.name;
            thisReview.rating = parseInt(req.body.rating, 10);
            thisReview.review = req.body.review;
            hotel.save(function(err, hotelUpdated) {
            if (err) {
                res
                    .status(500)
                    .json(err);
            } else {
                res
                    .status(204)
                    .json();
                console.log("hotelUpdated " + hotelUpdated);
                }
            });
        }
    });
};

module.exports.reviewsDeleteOne = function(req, res) {
var hotelId = req.params.hotelId;
var reviewId = req.params.reviewId;
console.log('DELETE reviewId ' + reviewId + ' for hotelId ' + hotelId);

    Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
        var thisReview;
        var response = {
        status : 200,
        message : {}
        };
        /*Error trapping*/
        if (err) {
            console.log("Error finding hotel");
            response.status = 500;
            response.message = err;
        } else if(!hotel) {
            console.log("Hotel id not found in database", hotelId);
            response.status = 404;
            response.message = {"message" : "Hotel ID not found " + hotelId };
        } else {
            // Get the review
            thisReview = hotel.reviews.id(reviewId);
            // If the review doesn't exist Mongoose returns null
            if (!thisReview) {
                response.status = 404;
                response.message = {"message" : "Review ID not found " + reviewId};
            }
        }
        if (response.status !== 200) {
            res
                .status(response.status)
                .json(response.message);
        } else {
            /*Delete subdocuments*/
            //Model instance, get reviews, get review by id, remove document
            hotel.reviews.id(reviewId).remove();
            hotel.save(function(err, hotelUpdated) {
            if (err) {
                res
                    .status(500)
                    .json(err);
            } else {
                res
                    .status(204)
                    .json();
                console.log("hotelUpdated " + hotelUpdated);
                }
            });
        }
    });
};