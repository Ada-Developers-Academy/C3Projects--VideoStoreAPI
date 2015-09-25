var express = require('express');
var router = express.Router();
var rentals_exports = require('../controllers/rentals');

router.post('/checkout', rentals_exports.create);
router.patch('/checkin', rentals_exports.update);
router.put('/checkin', rentals_exports.update);

module.exports = router;
