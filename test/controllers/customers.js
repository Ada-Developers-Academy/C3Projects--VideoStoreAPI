var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    Customer = require('../../customers');

describe("customers controller", function() {
  var customer, db_cleaner;

  beforeEach(function(done) {
    customer = new Customer();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM rentals; DELETE FROM customers; \
        INSERT INTO rentals(check_out, check_in, due_date, overdue, movie_title, customer_id) \
        VALUES('2015-06-16', '2015-06-17', '2015-06-19', 0, 'Jaws', 1), \
              ('2015-06-16', '2015-06-17', '2015-06-19', 1, 'Alien', 1); \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Harry', '2015-06-16', '1234', 'Seattle', 'WA', '98103', '1234567', 123), \
              ('Ron', '2014-06-14', '1234', 'Pasadena', 'CA', '90222', '1234432', 321);\
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("GET '/customers'", function() {
    it("knows about the route", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of all the customer objects", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(result.body[0]), keys);
          done();
        });
    });
  });
});
