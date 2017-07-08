var express = require('express');
var router = express.Router();

/*Controllers*/
var ctrlHotels = require('../controllers/hotels.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');

/*Routes*/
//Hotel routes
router
	.route('/hotels')
	//Chain multiple methods
	//Map controller to route
	.get(ctrlHotels.hotelsGetAll)
	.post(ctrlHotels.hotelsAddOne);

router
	//:URL Parameter
	.route('/hotels/:hotelId')
	.get(ctrlHotels.hotelsGetOne)
	//PUT is for complete updates only not partial updates
	.put(ctrlHotels.hotelsUpdateOne)
	.delete(ctrlHotels.hotelsDeleteOne);

//Review routes
router
	.route('/hotels/:hotelId/reviews')
	.get(ctrlReviews.reviewsGetAll)
	.post(ctrlReviews.reviewsAddOne);

router
	.route('/hotels/:hotelId/reviews/:reviewId')
	.get(ctrlReviews.reviewsGetOne)
	.put(ctrlReviews.reviewsUpdateOne)
	.delete(ctrlReviews.reviewsDeleteOne);

module.exports = router;