var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("customers routes", function() {
  var db_cleaner;

  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers (name, registered_at, address, city, state, \
        postal_code, phone, account_credit) \
        VALUES ('Dana Scully', 'Wed, 16 Apr 2014 21:40:20 -0700', \
          'P.O. Box 887, 4257 Lorem Rd.', 'Columbus', 'Ohio', '43201', \
          '(371) 627-1105', 1234), \
        ('Fox Mulder', 'Fri, 10 Jul 2015 15:23:06 -0700', '152-525 Odio St.', \
          'Seattle', 'Washington', '98109', '(206) 329-4928', 293); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("GET /customers", function() {
    it("responds with json", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of objects", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var customers = response.body.customers;

          assert(customers instanceof Array);
          done();
      });
    });

    it("returns as many customers as there are in the table: 2", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var customers = response.body.customers;

          assert.equal(customers.length, 2);
          done();
      });
    });

    it("the customer objects contain customer data", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var customer = response.body.customers[0];

          assert.equal(customer.name, "Dana Scully");
          assert.equal(customer.registered_at, 'Wed, 16 Apr 2014 21:40:20 -0700');
          assert.equal(customer.address, 'P.O. Box 887, 4257 Lorem Rd.');
          assert.equal(customer.city, "Columbus");
          assert.equal(customer.state, "Ohio");
          assert.equal(customer.postal_code, "43201");
          assert.equal(customer.phone, "(371) 627-1105");
          assert.equal(customer.account_credit, 1234);
          done();
      });
    });
  });

  // describe("GET /customers/:id", function() {
  //   it("res")
  // });
});
