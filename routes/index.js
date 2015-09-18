var express = require('express');
var router = express.Router();
var movie_exports = require('../controllers/movies')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/zomg', function(req, res, next){
  var results = {
    zomg: "it works!"
  };
  res.status(200).json(results);
});

module.exports = router;
