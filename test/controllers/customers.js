var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    express = require('express');

describe("Endpoints for /customers", function() {
  beforeEach(function(done){
    var db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(id, name, registered_at, address, city, state, postal_zip, phone_number, credit)\
        VALUES(1, 'Alice', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 10.14),\
              (2, 'Shanna', 'Sat, 19 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98103, '123-444-5555', 20.16),\
              (3, 'Marleigh', 'Sun, 20 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98104, '123-444-5555', 8.53),\
              (4, 'Joe', 'Mon, 21 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98105, '123-444-5555', 92.42),\
              (5, 'Steve', 'Tue, 22 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98106, '123-444-5555', 2.34);\
        DELETE FROM rentals; \
        INSERT INTO rentals(id, customer_id, customer_name, movie_id, return_date, checkout_date, due_date) \
        VALUES(1, 1, 'Alice', 5, 'Fri, 18 Aug 2015 07:00:00 -0700', 'Wed, 14 Aug 2015 10:00:00 -0700', 'Wed, 21 Aug 2015 10:00:00 -0700'), \
              (2, 2, 'Shanna', 2, '', 'Wed, 22 Jul 2015 10:00:00 -0700', 'Wed, 29 Jul 2015 10:00:00 -0700'), \
              (3, 1, 'Alice', 2, '', 'Tue, 7 Sep 2015 10:00:00 -0700', 'Tue, 14 Sep 2015 10:00:00 -0700'), \
              (4, 2, 'Shanna', 5, 'Tue, 7 Sep 2015 10:00:00 -0700', 'Tue, 1 Sep 2015 10:00:00 -0700', 'Tue, 8 Sep 2015 10:00:00 -0700'), \
              (5, 3, 'Marleigh', 5, '', 'Fri, 18 Sep 2015 10:00:00 -0700', 'Fri, 25 Sep 2015 10:00:00 -0700'); \
        COMMIT;",
          function(err) {
            db_cleaner.close();
            done();
          }
      );
    });
  })

  // '/customers'
  describe("GET all customers", function () {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent.get('/customers').set('Accept', 'application/json');
      done();
    })

    it ("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it ("returns an array of customer objects", function(done) {
      customer_request.expect(200, function(err,result) {
        assert.equal(result.body.length, 5);

        var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_zip', 'phone_number', 'credit'];
        assert.deepEqual(Object.keys(result.body[0]), keys);
        done();
      });
    });
  });

  describe ("Get a subset of customers", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent.get('/customers').set('Accept', 'application/json');
      done();
    }),

    // '/customers/:name/:results_per_page/:page_number'
    it("can get subset of customers by name", function(done) {
      customer_request = agent.get('/customers/name/5/1').set('Accept', 'application/json');
      customer_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error,result) {
            assert.equal(result.body.length, 5);

            var expected_customers = ['Alice', 'Joe', 'Marleigh', 'Shanna', 'Steve'],
            actual_customers = [];


            for(var i = 0; i < result.body.length; i++) {
              actual_customers.push(result.body[i].name);
            }

            assert.deepEqual(expected_customers, actual_customers);
            done();
          })
    }),

    // '/customers/:registered_at/:results_per_page/:page_number'
    it("can get subset of customers by date registered", function(done) {
      customer_request = agent.get('/customers/registered_at/5/1').set('Accept', 'application/json');
      customer_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error,result) {
            assert.equal(result.body.length, 5);

            var expected_dateRegistered = ['Fri, 18 Aug 2015 07:00:00 -0700','Mon, 21 Aug 2015 07:00:00 -0700',
             'Sat, 19 Aug 2015 07:00:00 -0700','Sun, 20 Aug 2015 07:00:00 -0700',
              'Tue, 22 Aug 2015 07:00:00 -0700'],
            actual_dateRegistered = [];

            for(var i = 0; i < result.body.length; i++) {
              actual_dateRegistered.push(result.body[i].registered_at);
            }

            assert.deepEqual(expected_dateRegistered, actual_dateRegistered);
            done(error);
          })
    }),

    // '/customers/:postal_zip/:results_per_page/:page_number'
    it("can get subset of customers by postal code", function(done) {
      customer_request = agent.get('/customers/postal_zip/5/1').set('Accept', 'application/json');
      customer_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error,result) {
            assert.equal(result.body.length, 5);

            var expected_postalZip = ['98102', '98103', '98104', '98105', '98106'],
            actual_postalZip = [];

            for(var i = 0; i < result.body.length; i++) {
              actual_postalZip.push(result.body[i].postal_zip);
            }

            assert.deepEqual(expected_postalZip, actual_postalZip);
            done();
          })
    }),

    // '/customers/:id/current'
    it("can get subset of current rentals by customer's id", function(done) {
      customer_request = agent.get('/customers/2/current').set('Accept', 'application/json');
      customer_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error,result) {
            assert.equal(result.body.length, 1);

            var expected_currentReturnDate = result.body[0].return_date,
            actual_currentReturnDate = "";

            assert.deepEqual(expected_currentReturnDate,
              actual_currentReturnDate);
            done();
          })
    })
  })
});
