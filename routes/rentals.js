var express = require('express');
var router = express.Router();
var rentals_exports = require('../controllers/rentals');

/* POST /rentals/checkout/:id/:title */
/* keeps looking for a GET... WIP */
// router.get('/checkout/:id/:title', function(req, res, next) {
  // return rentals_exports.rentalsController.create(req, res);
// });

router.post('/checkout/:id/:title', function(req, res, next) {
  console.log("id: " + req.param(id));
  return rentals_exports.rentalsController.create(req, res);
});

module.exports = router;
