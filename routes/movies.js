"use strict";

var express = require('express');
var router = express.Router();
var Controller = require('../controllers/movies');

router.get('/', Controller.index);

module.exports = router;
