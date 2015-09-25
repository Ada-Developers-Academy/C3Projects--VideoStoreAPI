"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/movies');

router.get('/', Controller.index);
// sort by movie title
router.get('/title/:records/:offset', Controller.title);
// sort by movie release date
router.get('/released/:records/:offset', Controller.released);

// get movie info and whether has inventory
router.get('/:title', Controller.available);

module.exports = router;
