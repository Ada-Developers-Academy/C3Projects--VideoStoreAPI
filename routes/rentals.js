var express = require('express');
var router = express.Router();
var Controller = require('../controllers/rentals');

router.get('/customers/current', Controller.customers_current);
router.get('/checkedout/:title', Controller.checkedout);
router.get('/history/:title', Controller.title_history);
router.get('/history/id/:title', Controller.id_history);
router.get('/history/name/:title', Controller.name_history);

router.get('/checkin/:title/:customer_id', Controller.checkin);
router.put('/checkin/:title/:customer_id', Controller.checkin);

router.get('/checkout/:title/:customer_id', Controller.checkout);
router.post('/checkout/:title/:customer_id', Controller.checkout);

router.get('/customers/overdue', Controller.overdue);

module.exports = router;
