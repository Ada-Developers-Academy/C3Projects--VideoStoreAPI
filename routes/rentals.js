var express = require('express');
var router = express.Router();
var rental_exports = require('../controllers/rentals');

// GET /movies
router.post('/', function(req, res, next) {
  rental_exports.rentalsController.create(res);
});

module.exports = router;
