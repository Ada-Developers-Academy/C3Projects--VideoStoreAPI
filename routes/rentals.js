var express = require('express');
var router = express.Router();
var rentalsController = require('../controllers/rentals');

// "GET ./rentals/{:title}"
router.get("/:title", function(req, res, next) {
  rentalsController.rentals(req, function(err, result) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.status(200).json(result);
    }
  })
})

module.exports = router;