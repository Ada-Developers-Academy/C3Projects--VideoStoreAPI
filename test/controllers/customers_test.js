"use strict";

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var agent = request.agent(app);
// var sqlite3 = require('sqlite3').verbose(); // currently unused

var resetTables = require('../dbCleaner');

describe.only('/customers', function() {
  describe("GET '/'", function() {
    var numCustomersSeeded;
    var request;

    before(function(done) {
      var data = {
        customers: [
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: 'Zip3', phone: 'Phone3', account_balance: '3000' }
        ]
      }
      numCustomersSeeded = data.customers.length;
      resetTables(data, done);
    });

    beforeEach(function() {
      request = agent.get('/customers').set('Accept', 'application/json');
    });

    it('responds with json', function(done) {
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('returns all customers in the body', function(done){
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);
          assert.equal(res.body.length, numCustomersSeeded);
          done();
        }
      );
    });

    it('returns an array of customer objects (with the appropriate keys)', function(done) {
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);

          var keys = [ 'id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_balance' ];
          assert.deepEqual(Object.keys(res.body[0]), keys);
          done();
        }
      );
    });
  });

  describe("GET '/?status=overdue'", function(){
    var request;

    before(function(done) {
      var data = {
        customers: [
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: 'Zip3', phone: 'Phone3', account_balance: '3000' }
        ],
        rentals: [
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'North by Northwest', customer_id: 2 },
          { checkout_date: '2015-09-09', return_date: '', movie_title: 'Wait Until Dark', customer_id: 3 },
          { checkout_date: '2015-08-10', return_date: '', movie_title: 'Jaws', customer_id: 1 }
        ]
      }
      resetTables(data, done);
    });

    beforeEach(function() {
      request = agent.get('/customers?status=overdue').set('Accept', 'application/json');
    });

    it('responds with json', function(done) {
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('returns 2 customers in the body', function(done) {
      request
      .expect(200, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.body.length, 2);
        done();
      });
    });

    it('returns an array of customer objects (with the appropriate keys)', function(done) {
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);

          var keys = [ 'id', 'name', 'movie_title', 'checkout_date' ];
          assert.deepEqual(Object.keys(res.body[0]), keys);
          done();
        }
      );
    });

  });
});
