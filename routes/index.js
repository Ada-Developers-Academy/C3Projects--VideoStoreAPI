var express = require('express');
var router = express.Router();
var index_exports = require('../controllers/index')

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  return index_exports.indexController.zomg(req,res);

});

module.exports = router;
