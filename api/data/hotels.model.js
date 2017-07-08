/*Mongose Schema*/
var mongoose = require('mongoose');

//Sub documents get their own schema
var reviewSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        min : 0,
        max : 5,
        required : true
    },
    review : {
        type : String,
        required : true
    },
    createdOn : {
        type : Date,
        "default" : Date.now
    }
});

var roomSchema = new mongoose.Schema({
    type : String,
    number: Number,
    description: String,
    photos : [String],
    price : Number
});

var hotelSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    stars : {
        type : Number,
        min : 0,
        max	: 5,
        "default" : 0
    },
    services : [String], //Array of strings
    description : String,
    photos : [String],
    currency : String,
    //Nested schemas must be defined before the parent schema
    reviews : [reviewSchema], //Nested schema object reviewSchema declared earlier
    rooms : [roomSchema], //Nested schema object roomSchema declared earlier
    location : {
        address : String,
        //Always store coordinates longitue (E/W), latitude (N/S) order
        coordinates : {
            type: [Number],
            index : '2dsphere'
        }
    }
});

//@param1 name of model to use will look in database for collection lowercase and plural
//@param2 name of schema to use
//@param3 name of mongodb collection to use
mongoose.model('Hotel', hotelSchema, 'hotels');