"use strict";

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var agent = request.agent(app);

var resetTables = require('../dbCleaner');

describe('/customers', function() {
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
        });
    });

    it('returns an array of customer objects (with the appropriate keys)', function(done) {
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);

          var keys = [ 'id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_balance' ];
          assert.deepEqual(Object.keys(res.body[0]), keys);
          done();
        });
    });
  });

  describe("GET '?status=overdue'", function(){
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

          var keys = [ 'customer_id', 'name', 'movie_title', 'checkout_date', 'rental_id' ];
          assert.deepEqual(Object.keys(res.body[0]), keys);
          done();
        });
    });
  });

  describe("GET '?sort'", function() {
    before(function(done) {
      var data = {
        customers: [
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer4', registered_at: '2013-01-25', address: 'Address4', city: 'City4', state: 'State4', postal_code: 'Zip4', phone: 'Phone4', account_balance: '0050' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: '3Zip3', phone: 'Phone3', account_balance: '3000' }
        ]
      }
      resetTables(data, done);
    });

    describe("GET '?sort=registered_at'", function() {
      var request;

      beforeEach(function() {
        request = agent.get('/customers?sort=registered_at').set('Accept', 'application/json');
      });

      it('responds with json', function(done) {
        request
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });

      it('returns an array of customer objects (with the appropriate keys)', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);

            var keys = [ 'id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_balance' ];
            assert.deepEqual(Object.keys(res.body[0]), keys);
            done();
          });
      });

      it('returns all customers, sorted by when they registered', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);
            assert.equal(res.body.length, 4);
            assert.equal(res.body[0].name, 'Customer4');
            assert.equal(res.body[1].name, 'Customer3');
            assert.equal(res.body[2].name, 'Customer2');
            assert.equal(res.body[3].name, 'Customer1');
            done();
          });
      });
    });

    describe("GET '?sort=postal_code'", function() {
      var request;

      beforeEach(function() {
        request = agent.get('/customers?sort=postal_code').set('Accept', 'application/json');
      });

      it('responds with json', function(done) {
        request
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });

      it('returns an array of customer objects (with the appropriate keys)', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);

            var keys = [ 'id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_balance' ];
            assert.deepEqual(Object.keys(res.body[0]), keys);
            done();
          });
      });

      it('returns all customers, sorted by postal code', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);
            assert.equal(res.body.length, 4);
            assert.equal(res.body[0].name, 'Customer3');
            assert.equal(res.body[1].name, 'Customer1');
            assert.equal(res.body[2].name, 'Customer2');
            assert.equal(res.body[3].name, 'Customer4');
            done();
          });
      });
    });

    describe("GET '?sort=name'", function() {
      var request;

      beforeEach(function() {
        request = agent.get('/customers?sort=name').set('Accept', 'application/json');
      });

      it('responds with json', function(done) {
        request
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });

      it('returns an array of customer objects (with the appropriate keys)', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);

            var keys = [ 'id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_balance' ];
            assert.deepEqual(Object.keys(res.body[0]), keys);
            done();
          });
      });

      it('returns all customers, sorted by name', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);
            assert.equal(res.body.length, 4);
            assert.equal(res.body[0].name, 'Customer1');
            assert.equal(res.body[1].name, 'Customer2');
            assert.equal(res.body[2].name, 'Customer3');
            assert.equal(res.body[3].name, 'Customer4');
            done();
          });
      });
    });

    describe("GET '?sort=name&n=2&p=2'", function() {
      var request;

      beforeEach(function() {
        request = agent.get('/customers?sort=name&n=2&p=2').set('Accept', 'application/json');
      });

      it('responds with json', function(done) {
        request
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });

      it('returns an array of customer objects (with the appropriate keys)', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);

            var keys = [ 'id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_balance' ];
            assert.deepEqual(Object.keys(res.body[0]), keys);
            done();
          });
      });

      it('only returns the correct 2 customers in the body', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);
            assert.equal(res.body.length, 2);
            assert.equal(res.body[0].name, 'Customer3');
            assert.equal(res.body[1].name, 'Customer4');
            done();
          });
      });
    });

    describe("GET '?sort=name&n=2&p=cat' (invalid p)", function() {
      var request;

      beforeEach(function() {
        request = agent.get('/customers?sort=name&n=2&p=cat').set('Accept', 'application/json');
      });

      it('responds with json', function(done) {
        request
          .expect('Content-Type', /application\/json/)
          .expect(200, done);
      });

      it('returns an array of customer objects (with the appropriate keys)', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);

            var keys = [ 'id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_balance' ];
            assert.deepEqual(Object.keys(res.body[0]), keys);
            done();
          });
      });

      it('only returns the correct 2 customers in the body (treats p as 1)', function(done) {
        request
          .expect(200, function(err, res) {
            assert.equal(err, undefined);
            assert.equal(res.body.length, 2);
            assert.equal(res.body[0].name, 'Customer1');
            assert.equal(res.body[1].name, 'Customer2');
            done();
          });
      });
    });

    describe("GET '?sort=name&n=cat' (invalid n)", function() {
      var request;
      var expectedResponse;

      before(function(done) {
        agent.get('/customers?sort=name').set('Accept', 'application/json')
          .end(function(err, res) {
            expectedResponse = res;
            done();
          });
      });

      beforeEach(function() {
        request = agent.get('/customers?sort=name&n=cat').set('Accept', 'application/json');
      });

      it('is equivalent to not including n', function(done) {
        request
          .expect(200, function(err, res) {
            assert.deepEqual(res.body, expectedResponse.body);
            done();
          });
      });
    });

    describe("GET '?sort=name&p=2' (missing n, includes p)", function() {
      var request;
      var expectedResponse;

      before(function(done) {
        agent.get('/customers?sort=name&p=2').set('Accept', 'application/json')
          .end(function(err, res) {
            expectedResponse = res;
            done();
          });
      });

      beforeEach(function() {
        request = agent.get('/customers?sort=name&n=cat').set('Accept', 'application/json');
      });

      it('is equivalent just including sort, without p or n', function(done) {
        request
          .expect(200, function(err, res) {
            assert.deepEqual(res.body, expectedResponse.body);
            done();
          });
      });
    });

    describe("GET '?sort=name&n=cat&p=2' (invalid n, includes p)", function() {
      var request;
      var expectedResponse;

      before(function(done) {
        agent.get('/customers?sort=name&n=cat&p=2').set('Accept', 'application/json')
          .end(function(err, res) {
            expectedResponse = res;
            done();
          });
      });

      beforeEach(function() {
        request = agent.get('/customers?sort=name&n=cat').set('Accept', 'application/json');
      });

      it('is equivalent just including sort, without p or n', function(done) {
        request
          .expect(200, function(err, res) {
            assert.deepEqual(res.body, expectedResponse.body);
            done();
          });
      });
    });

    describe("GET '?sort=puppies' (invalid sort parameter)", function() {
      var request;

      beforeEach(function() {
        request = agent.get('/customers?sort=puppies').set('Accept', 'application/json');
      });

      it('responds with json, status code 400, and appropriate error message', function(done) {
        request
          .expect('Content-Type', /application\/json/)
          .expect(400, function(err, res) {
            assert.equal(err, undefined);
            assert.equal(res.error.text, '"Bad request"');
            done();
          });
      });
    });
  });

  describe("GET '/:id/rentals", function() {
    var err;
    var res;

    before(function(done) {
      var data = {
        customers: [
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
          { name: 'Customer3', registered_at: '2014-01-25', address: 'Address3', city: 'City3', state: 'State3', postal_code: 'Zip3', phone: 'Phone3', account_balance: '3000' }
        ],
        rentals: [
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'North by Northwest', customer_id: 1 },
          { checkout_date: '2015-09-09', return_date: '', movie_title: 'Wait Until Dark', customer_id: 1 },
          { checkout_date: '2015-08-10', return_date: '', movie_title: 'Jaws', customer_id: 2 }
        ]
      }
      resetTables(data, done);
    });

    before(function(done) {
      agent.get('/customers/1/rentals').set('Accept', 'application/json').end(function(error, result) {
        err = error;
        res = result;
        done();
      });
    });

    it('returns JSON', function() {
      assert.equal(err, undefined);
      assert.equal(res.status, 200);
    });

    it('includes an object with attributes: past and current', function() {
      assert.equal(res.body.past.length, 1);
      assert.equal(res.body.current.length, 1);
    });

    it('past includes rentals with a return date', function() {
      assert.equal(res.body.past[0].return_date, '2015-03-20');
    });

    it('current includes rentals without a return date', function() {
      assert.equal(res.body.current[0].return_date, '');
    });

    it('all rentals have a rental id', function() {
      assert.equal(res.body.current[0].id, 2);
      assert.equal(res.body.past[0].id, 1);
    });
  });
});
