"use strict";

exports.zomgController = {
  itWorks: function itWorks(req, res) {
    // this is zomg action
    var result = {
      it_works: "it works!",
      no_really: "no, really!"
    }

    return res.status(200).json(result);
  }
}
