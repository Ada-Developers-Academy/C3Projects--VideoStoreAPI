"use strict";

exports.indexController = {
  zomg: function zomg(req,res) {
    var results = {
      zomg: "zomg it WORKED!",
      moar: "zomg moar"
    };

    return res.status(200).json(results);
  },
}
