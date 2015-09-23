"use strict";

function Movie() {
  this.table_name = "movies";
}

Movie.prototype = require('../database_adapter');

module.exports = Movie;
