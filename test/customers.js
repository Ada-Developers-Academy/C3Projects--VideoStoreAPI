var assert = require('assert'),
    Customer  = require('../models/customer'),
    sqlite3 = require('sqlite3').verbose();

describe("Customer", function() {
  var customer, db_cleaner;

  beforeEach(function(done) {
    customer = new Customer();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Beetlejuice', '10/10/2010', 'Yesterday', '123 street', 'Burlington', 'WA', 98233, 3604216650, 5.25), \
              ('Juice', '10/10/2010', 'Yesterday', '123 street', 'Burlington', 'WA', 98233, 3604216650, 5.55); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  it("can be instantiated", function() {
    assert(customer instanceof Customer);
  });

  describe("instance methods", function() {
    context("GET #find_all", function() {
      it("retrieves all customer records", function(done) {
        customer.find_all(function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 2);
          assert.equal(res[0].name, 'Beetlejuice');
          done();
        });
      });
    });
  });
});
