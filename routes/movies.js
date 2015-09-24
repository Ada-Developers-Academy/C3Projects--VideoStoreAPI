"use strict";

var express = require('express');
var router = express.Router();
var Controller = require('../controllers/movies');

router.get('/', Controller.index);
router.get('/:title', Controller.show);

module.exports = router;
