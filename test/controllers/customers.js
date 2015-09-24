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
              (2, 'Shanna', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 20.16),\
              (3, 'Marleigh', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 8.53),\
              (4, 'Joe', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 92.42),\
              (5, 'Steve', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 2.34);\
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
// '/customers/:name/:results_per_page/:page_number'
  describe ("Get a subset of customers", function() {
    var customer_request;

    it("can get subset of customers by name", function() {
      customer_request = agent.get('/customers/:name/5/1').set('Accept', 'application/json');
      customer_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error,result) {
            assert.equal(result.body.length, 5);

            var expected_customers = ['Alice', 'Shanna', 'Marleigh', 'Joe', 'Steve'],
            actual_customers = [];

            for(var index in result.body) {
              actual_customers.push(result.body[0].name);
            }

            assert.deepEqual(expected_customers, actual_customers);
            done(error);
          })
    })
  })
// '/customers/:registered_at/:results_per_page/:page_number'
// '/customers/:postal_code/:results_per_page/:page_number'
// '/customers/:id/current'
// '/customers/:id/previous'










});
