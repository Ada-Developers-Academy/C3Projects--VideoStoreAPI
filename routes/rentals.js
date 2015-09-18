var express = require('express');
var router = express.Router();
var rentals_exports = require('../controllers/rentals');

/* GET RENTAL ROUTES */
router.get('/', function(req, res, next) {
  return rentals_exports.rentalsController.rentals(req, res);
});
