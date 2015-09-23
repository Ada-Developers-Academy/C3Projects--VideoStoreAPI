var request             = require('supertest'),
    assert              = require('assert'),
    app                 = require('../app'),
    sqlite3             = require('sqlite3').verbose(),
    agent               = request.agent(app);
    customersController = require("../controllers/customers");

describe("customersController", function() {
  var test_db;

  beforeEach(function(done) {
    test_db = new sqlite3.Database('db/test.db');
    
    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM customers; \
        DELETE FROM rentals; \
        DELETE FROM movies; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Sarah', 'Wed', 'Ipsum Rd', 'Seattle', 'WA', '12345', '(123) 123-4567', 25.15), \
              ('Jane', 'Thurs', '123 St', 'San Jose', 'CA', '56789', '(345) 124-2984', 12.00); \
        INSERT INTO rentals(customer_id, name, movie_id, title, checkout_date, due_date, return_date) \
        VALUES(1, 'Sarah', 1, 'Movie 1', '2015-07-14', '2015-07-21', '2015-07-21'), \
              (1, 'Sarah', 2, 'Movie 2', '2015-07-16', '2015-07-23', '2015-07-19'), \
              (1, 'Sarah', 3, 'Movie 3', '2015-07-01', '2015-07-08', '2015-07-09'), \
              (2, 'Jane', 4, 'Movie 4', '2015-07-14', '2015-07-21', '2015-07-15'), \
              (2, 'Jane', 5, 'Movie 5', '2015-07-16', '2015-07-23', '2015-07-17'), \
              (2, 'Jane', 6, 'Movie 6', '2015-07-01', '2015-07-08', '2015-07-02'); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  });

  it("has an 'all_customers' property that is a function", function() {
    assert.equal(typeof customersController.all_customers, "function");
  });

  describe('GET /', function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent.get('/customers').set('Accept', 'application/json');
      done();
    })

    it('responds with json', function(done) {
      customer_request
        .expect('Content-type', /application\/json/)
        .expect(200, done);
    })

    it('returns an array of customer objects', function(done) {
      customer_request.expect(200, function(error, result) {
        assert.equal(result.body.customers.length, 2);

        var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
        assert.deepEqual(Object.keys(result.body.customers[0]), keys);
        
        done();
      })
    })
  })

  it("has a 'customer' property that is a function", function() {
    assert.equal(typeof customersController.customer, "function");
  });

  describe('GET /:id', function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent.get('/customers/2').set('Accept', 'application/json');
      done();
    })

    it('responds with json', function(done) {
      customer_request
        .expect('Content-type', /application\/json/)
        .expect(200, done);
    })

    it('finds the right customer record', function(done) {
      customer_request.expect(200, function(error, result) {
        assert.deepEqual(result.body.account.name, 'Jane');
        done();
      })
    })

    it("includes the customer's rental history", function(done) {
      customer_request.expect(200, function(error, result) {
        assert.equal(result.body.rented.length, 3);
        assert.deepEqual(result.body.rented[0].title, "Movie 6");
        done();
      })
    })

  })

})
