"use strict";

exports.indexController = {
  zomg: function zomg(req,res) {
    var results = {
      zomg: "zomg it worked",
    }
    return res.status(200).json(results);
  }
}
