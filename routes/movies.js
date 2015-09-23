"use strict";

var express = require('express'),
    router = express.Router(),
    Controller = require('../controllers/movies');

router.get('/', Controller.index);
router.get('/title/:records/:offset', Controller.title);
router.get('/released/:records/:offset', Controller.released);

module.exports = router;

// var express = require('express');
// var router = express.Router();
// var movies_exports = require('../controllers/movies')
//
// /* GET home page. */
// router.get('/', function(req, res, next) {
//   return movies_exports.moviesController.index(req, res);
// });
// // sort by movie title
// router.get('/title/:records/:offset', function(req, res, next) {
//   return movies_exports.moviesController.title(req, res);
// });
//
// // sort by movie release date
// router.get('/released/:records/:offset', function(req, res, next) {
//   return movies_exports.moviesController.released(req, res);
// });
//
// // get movie info and whether has inventory
// router.get('/:title', function(req, res, next) {
//  return movies_exports.moviesController.movie_available(req, res);
// });
//
// module.exports = router;
