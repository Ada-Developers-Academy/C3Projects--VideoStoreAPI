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
