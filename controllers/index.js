"use strict";

exports.indexController = {
  zomg: function zomg(req,res) {
    var results = {
      zomg: "It works!",
    }
    return res.status(200).json(results);
  }
}
