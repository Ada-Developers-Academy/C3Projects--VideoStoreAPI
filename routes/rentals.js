"use strict";

var express = require('express');
var router = express.Router();
var Controller = require('../controllers/movies');

router.post('/', Controller.create);

module.exports = router;
