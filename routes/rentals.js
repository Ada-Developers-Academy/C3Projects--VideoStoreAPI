var express = require('express');
var router = express.Router();
var rental_exports = require('../controllers/rentals');

// GET /rentals
router.get('/', function(req, res, next) {
  rental_exports.rentalsController.getAllRentals(res);
});

// GET /rentals/overdue
router.get('/overdue', function(req, res, next) {
  rental_exports.rentalsController.getAllOverdue(res);
});

// GET /rentals/currently_out
router.get('/currently_out', function(req, res, next){
  rental_exports.rentalsController.getAllCurrentlyOut(res);
});

// GET rentals/available_inventory
router.get('/available_inventory', function(req, res, next){
  rental_exports.rentalsController.getAvailableInventory(res);
});

// GET rentals/current_renters/:title
router.get('/current_renters/:title', function(req, res, next) {
  rental_exports.rentalsController.getAllCurrentRenters(req.params.title, res);
});

// POST rentals/check_in?id=XXX&title=XXX
router.post('/check_in', function(req, res, next) {
  rental_exports.rentalsController.checkIn(req.query.id, req.query.title, res);
});

// POST rentals/check_out?id=XXX&title=XXX
router.post('/check_out', function(req, res, next) {
  rental_exports.rentalsController.checkOut(req.query.id, req.query.title, res);
});

// POST /rentals
// check_out & check_in
router.post('/', function(req, res, next) {
  rental_exports.rentalsController.create(res);
});

module.exports = router;
