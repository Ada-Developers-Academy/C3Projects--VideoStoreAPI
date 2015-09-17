var express = require('express');
var router = express.Router();
var rentals_exports = require("../controllers/rentals");

/* GET home page. */
router.get('/', function(req, res, next) {
 // return rentals_exports.rentalsController.zomg(req, res);
});

module.exports = router;
