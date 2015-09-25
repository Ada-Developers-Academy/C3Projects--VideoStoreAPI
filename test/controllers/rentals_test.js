"use strict";

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var Rental = require('../../models/rental');
var agent = request.agent(app);
// var sqlite3 = require('sqlite3').verbose(); // currently unused

var resetTables = require('../dbCleaner');

describe('/rentals', function() {
  describe("POST '/'", function() {
  });

  describe("PUT '/2'", function() {
    var rental = new Rental;
    var request;

    beforeEach(function(done) {
      var data = {
        rentals: [
          { checkout_date: '2015-09-16', return_date: '', movie_title: 'Wait Until Dark', customer_id: 9 },
          { checkout_date: '2015-08-24', return_date: '', movie_title: 'Wait Until Dark', customer_id: 2 },
        ]
      }
      resetTables(data, done);
    });

    beforeEach(function(done) {
      request = agent.put('/rentals/2').set('Content-Type', 'application/json')
      .send({'return_date':'2015-09-23'})
      .send({'movie_title':'Wait Until Dark'})
      .end(done);
    });

    it('updates the rental to have a return_date', function(done) {
      request
      rental.findBy('customer_id', 2, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].customer_id, 2)
        assert.equal(rows[0].return_date, '2015-09-23');

        rental.findBy('customer_id', 9, function(err, rows) {
          assert.equal(err, undefined);
          assert.equal(rows.length, 1);
          assert.equal(rows[0].customer_id, 9);
          assert.equal(rows[0].return_date, '');
          done();
        });
      });
    });
  });
});
