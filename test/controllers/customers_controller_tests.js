var request = require('supertest');
var assert  = require('assert');
var app     = require('../../app');
var sqlite3 = require('sqlite3').verbose();
var agent   = request.agent(app);
// var CustomersController = require("../controllers/customers");

describe("Customers Controller", function() {
  // var cc = null,
  //     db = null;
  // beforeEach(function() {
  //   db = new Database("db/test.db");
  //   cc = new CustomerController;
  // });
  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN TRANSACTION; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('A', '2015-01-01', '111 St', 'Seattle', 'WA', '55555', '555-5555', 19.50), \
              ('B', '2015-01-02', '222 St', 'Seattle', 'WA', '55555', '666-6666', 18.50); \
        COMMIT TRANSACTION;",
        function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  })

  describe("GET /customers", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
        // .end(function(err, res) {
        //   if (err) return done(err);
        //   done();
        // });
    });

    it("returns an array of all customer objects", function(done) {
      customer_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(result.body[0]), keys);
          done();
        })
    });
  });

  describe("GET /customers/:id", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/1')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it("can find customer with id 1", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          console.log(res);
          assert.equal(res.body.length, 1);

          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          var customer = res.body[0]
          assert.deepEqual(Object.keys(customer), keys);

          assert.equal(customer.name, 'A');
          assert.equal(customer.registered_at, '2015-01-01');
          assert.equal(customer.address, '111 St');
          assert.equal(customer.city, 'Seattle');
          assert.equal(customer.state, 'WA');
          assert.equal(customer.postal_code, '55555');
          assert.equal(customer.phone, '555-5555');
          assert.equal(customer.account_credit, 19.50);

          done();
        })
    });

  });

  // describe("GET /customers/by_name", function() {
  //
  // });
  //
  // describe("GET /customers/by_registered_at", function() {
  //
  // });
  //
  // describe("GET /customers/by_postal_code", function() {
  //
  // });
});

// THEY ALL SHOULD:
//
// it("returns JSON", function() {
//
// });
//
// it("should return 200 if results", function() {
//
// });
//
// it("should return 204 if no results", function() {
//
// });
