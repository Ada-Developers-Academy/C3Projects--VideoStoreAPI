var assert = require("assert");
var customersController = require("../controllers/customers");

describe("customersController", function() {

  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Sarah', 'Wed', 'Ipsum Rd', 'Seattle', 'WA', '12345', '(123) 123-4567', 25.15), \
              ('Jane', 'Thurs', '123 St', 'San Jose', 'CA', '56789', '(345) 124-2984', 12.00); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  it("has an 'all_customers' property that is a function", function() {
    assert.equal(typeof customersController.all_customers, "function");
  });

  it("returns a json object", function(done) {
    customersController.all_customers(req, function(err, result) {
      assert(typeof result, "json");
    });
  });

})