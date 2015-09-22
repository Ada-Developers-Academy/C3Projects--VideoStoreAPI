var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// *GET*  rental/title

// *GET*  rental/title/available

// *GET*  rental/title/customers

// *POST* rental/title/:id/checkout

// *POST* rental/title/:id/checkin

// *GET*  rental/customers/overdue
module.exports = router;
