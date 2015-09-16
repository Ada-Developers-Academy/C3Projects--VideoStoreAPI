"use strict";

exports.zomgController = {

  zomg: function(req, res) {
    return res.status(200).json({ zomg: "it worked!" });
  }
}
