var express = require('express');
var router = express.Router();
var rentalsController = require('../controllers/rentals');

// "GET ./rentals/title/{:title}"
router.get("/title/:title", function(req, res, next) {
  rentalsController.rentals(req, function(err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  })
})

// "GET ./rentals/overdue"
router.get("/overdue", function(req, res, next) {
  rentalsController.rentals_overdue(req, function(err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  })
})

// "POST ./rentals/{:customer_id}/checkout/{:movie_id}"
router.post("/:customer_id/checkout/:movie_id", function(req, res, next) {
  rentalsController.checkout_movie(req, function(err, result) {
     if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }   
  })
})

// "PUT ./rentals/{:customer_id}/return/{:movie_id}"
router.put("/:customer_id/return/:movie_id", function(req, res, next) {
  rentalsController.return_movie(req, function(err, result) {
     if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }   
  })
})

module.exports = router;