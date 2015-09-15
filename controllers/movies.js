"use strict";

exports.moviesController = {
  zomg: function getZomg(req, res) {
    var results = {
      zomg: "it works!"
    }
    return res.status(200).json(results);
  }
}
