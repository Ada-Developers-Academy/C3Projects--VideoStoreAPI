var express = require('express');
var router = express.Router();
var rentals_exports = require('../controllers/rentals');

router.post('/checkout', rentals_exports.create);

module.exports = router;
