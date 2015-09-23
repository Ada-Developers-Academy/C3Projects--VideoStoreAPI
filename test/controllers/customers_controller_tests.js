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
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent
                      .get('/customers')
                      .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      movie_request
        .expect('Content-Type', /application\/xmljson/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    })

    // it("returns all customers")
  });

  // describe("GET /customers/:id", function() {
  //
  // });
  //
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
