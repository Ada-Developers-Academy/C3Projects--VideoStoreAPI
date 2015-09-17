"use strict";

var express = require('express');
var router = express.Router();
var zomgExports = require("../controllers/zomgController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Video Killed The Radio Star' });
});

/* GET zomg page. */
router.get('/zomg', function(req, res, next) {
  return zomgExports.zomgController.itWorks(req, res)
});

module.exports = router;
