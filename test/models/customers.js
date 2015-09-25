var assert = require('assert'),
    Customer  = require('../../models/customer'),
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
        VALUES('Jan', '2015-09-01', '123 Nope St', 'Seattle', 'WA', '98104', '(206) 555-5555)', 100), \
              ('Stan', '2015-09-02', '123 Nope St', 'Seattle', 'WA', '98104', '(206) 555-5555)', 100), \
              ('Dan', '2015-09-03', '123 Nope St', 'Seattle', 'WA', '98104', '(206) 555-5555)', 100), \
              ('Mann', '2015-09-04', '123 Nope St', 'Seattle', 'WA', '98104', '(206) 555-5555)', 100), \
              ('Bam', '2014-09-05', '123 Nope St', 'Seattle', 'WA', '98104', '(206) 555-5555)', 100); \
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
    it("can find all customers", function(done) {
      customer.all(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 5);

        assert.equal(res[0].name, 'Jan');
        assert.equal(res[1].name, 'Stan');

        done();
      });
    });

    it("can find some of the customers", function(done) {
      customer.find_by_with_limit("name", "%n%", 100, 0, function(error, result) {
        assert.equal(error, undefined);
        assert(result instanceof Array);
        assert.equal(result.length, 4);

        var expected_names = ['Dan', 'Jan', 'Mann', 'Stan'],
            actual_names = [];

        for(var index in result) {
          actual_names.push(result[index].name);
        }

        assert.deepEqual(expected_names, actual_names);
        done();
      });
    });

    it("can put some of the customers in date order", function(done) {
      customer.find_by_with_limit("registered_at", "%4%", 100, 0, function(error, result) {
        assert.equal(error, undefined);
        assert(result instanceof Array);
        assert.equal(result.length, 2);

        var expected_names = ['Bam', 'Mann'],
            actual_names = [];

        for(var index in result) {
          actual_names.push(result[index].name);
        }

        assert.deepEqual(expected_names, actual_names);

        done();
      });
    });

    it("can find a customer by id", function(done){
      customer.find_by("id", 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);
        assert.equal(res[0].id, 1);
        done();
      });
    });

    it("can find a customer by name", function(done) {
      customer.find_by("name", "%Bam%", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);
        assert.equal(res[0].name, 'Bam');
        done();
      });
    });
  });
});
