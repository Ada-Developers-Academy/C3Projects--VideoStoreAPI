var express = require('express');
var router = express.Router();
var movie_exports = require('../controllers/movies')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/zomg', function(req, res, next){
  return movie_exports.moviesController.zomg(req, res);
});

module.exports = router;
