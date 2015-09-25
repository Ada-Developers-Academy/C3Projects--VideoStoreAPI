var assert = require('assert'),
    Customer  = require('../../models/customers'),
    Rental = require('../../models/rentals'),
    sqlite3 = require('sqlite3').verbose();

describe("Customer", function() {
  var customer, rental, db_cleaner

  beforeEach(function(done) {
    customer = new Customer(),
    rental = new Rental();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        DELETE FROM rentals; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Jim', 'Wed, 29 Apr 2015 07:54:14 -0700', '1800 Some Place', 'whooville', 'TX', '90211', '555-5555', 17.38), \
              ('Jack', 'Tue, 4 Apr 2015 07:54:14 -0700', '555 Some Where', 'anthill', 'CA', '90210', '123-4444', 19.84); \
        INSERT INTO rentals(checkout_date, due_date, return_date, overdue, customer_title, customer_id) \
        VALUES('2015-09-10', '2015-09-13', '2015-09-12', 0, 'Jaws', 1), \
              ('2015-09-17', '2015-09-21', null, 0, 'Jawsier', 1); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  })

  it("can be instantiated", function() {
    assert(customer instanceof Customer);
  })

  describe("instance methods", function() {
    it("can find all customers", function(done) {
      customer.all(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].name, 'Jim');
        assert.equal(res[1].name, 'Jack');

        done();
      })
    })

    it("can find some of the customers", function(done) {
      customer.some('name', 1, 1, function(error, result) {
        assert.equal(error, undefined);
        assert(result instanceof Array);
        assert.equal(result.length, 1);

        assert.equal(result[0].name, 'Jim');

        done();
      })
    })

    it("can find a customer by id", function(done){
      rental.find_by("customer_id", 'return_date IS NULL', 1, function(err, res) {
        assert.equal(err, undefined);
        console.log(res)
        assert(res instanceof Array);
        assert.equal(res.length, 1);
        assert.equal(res[0].customer_id, 1);
        done();
      })
    })

  })
})
