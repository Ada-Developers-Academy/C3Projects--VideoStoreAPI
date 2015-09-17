"use strict";

exports.moviesController = {
  zomg: function getZomg(req, res) {
    var results = {
      zomg: "it works!"
    }
    return res.status(200).json(results);
  }

  /*
  GET /movies

  Get /movies/:id(synopsis, inventory, release_date)

  GET /movies/:title/inventory

  GET /movies/title?n=XXX&p=XXX

  GET /movies/release_date?n=XXX&p=XXX

  GET /movies/:title/checked_out_current

  GET /movies/:title/checked_out_history?ordered_by=XXX
    // ordered_by
      // - id
      // - name
      // - check out date
  */
}
