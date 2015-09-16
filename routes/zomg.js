var express = require('express');
var router = express.Router();
var zomg_exports = require('../controllers/zomg');

/* GET */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  return zomg_exports.zomgController.zomg(req, res);
});

module.exports = router;
