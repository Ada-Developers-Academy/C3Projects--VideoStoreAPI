"use strict";

var movieTable = require('../models/movie');
var MoviesController = {};

//--------- GET /all -----------------------------------------------------------
MoviesController.all = function(request, response) {
  var movies = new movieTable();
  var page = request.params.page || 1;

  movies.all(page, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET /all, sort by title --------------------------------------------
MoviesController.all_by_title =  function(request, response) {
  var movies = new movieTable();
  var page = request.params.page || 1;

  movies.all_by_title(page, function(error, result) {
    if (error) { result  = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET /all, sort by release_date -------------------------------------
MoviesController.all_by_release_date = function(request, response) {
  var movies = new movieTable();
  var page = request.params.page || 1

  movies.all_by_release_date(page, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET /:title, aka Movie#show ----------------------------------------
MoviesController.title = function(request, response) {
  var movies = new movieTable();
  var queried_title = request.params.title;

  movies.title(queried_title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET rentals of :title, sorted by customer_id -----------------------
MoviesController.rentals_by_customer_id = function(request, response) {
  var movies = new movieTable();
  var title = request.params.title;

  movies.rentals_by_customer_id(title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET rentals of :title, sorted by customer_name ---------------------
MoviesController.rentals_by_customer_name = function(request, response) {
  var movies = new movieTable();
  var title = request.params.title;

  movies.rentals_by_customer_name(title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET rentals of :title, sorted by check_out_date --------------------
MoviesController.rentals_by_check_out_date = function(request, response) {
  var movies = new movieTable();
  var title = request.params.title;

  movies.rentals_by_check_out_date(title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

//--------- GET a list of customers who have rented :title ---------------------
MoviesController.whos_renting = function(request, response) {
  var movies = new movieTable();
  var title = request.params.title;

  movies.whos_renting(title, function(error, result) {
    if (error) { result = error; }

    return response.status(result.meta.status).json(result);
  })
}

module.exports = MoviesController;
