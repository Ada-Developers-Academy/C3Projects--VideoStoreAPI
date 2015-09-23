"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/customers');

router.get('/', Controller.index);
router.get('/name/:records/:offset', Controller.name);
router.get('/registered/:records/:offset', Controller.registered);
router.get('/postal/:records/:offset', Controller.postal);
router.get('/current/:id', Controller.current);
router.get('/history/:id', Controller.history);

module.exports = router;

// ORIGINAL CODE ---------------------------------------------------------------

// var express = require('express');
// var router = express.Router();
// var customers_exports = require('../controllers/customers')
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   return customers_exports.customersController.index(req, res);
// });
//
// router.get('/name/:records/:offset', function(req, res, next) {
//   return customers_exports.customersController.name(req, res);
// });
//
// router.get('/registered/:records/:offset', function(req, res, next) {
//   return customers_exports.customersController.registered(req, res);
// });
//
// router.get('/postal/:records/:offset', function(req, res, next) {
//   return customers_exports.customersController.postal(req, res);
// });
//
// router.get('/current/:id', function(req, res, next) {
//   return customers_exports.customersController.current(req, res);
// });
//
// router.get('/history/:id', function(req, res, next) {
//   return customers_exports.customersController.history(req, res);
// });
//
// module.exports = router;
