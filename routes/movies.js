var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //return list of all movies
  // return customer_exports.customerController.index(req, res);
});

router.get('/one_movie', function(req, res, next) {
  // return one customer based on title
  //return customer_exports.customerController.one_customer(req, res);
});

router.get('/group_movies', function(req, res, next) {
  // return subsets of movies, might be two different endpoints
  // return res.status(200).json({ id: req.params.id })
});


module.exports = router;
