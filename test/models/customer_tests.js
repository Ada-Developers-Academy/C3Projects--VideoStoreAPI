var assert = require("assert"),
    Customer = require('../../models/customer'),
    sqlite3 = require('sqlite3').verbose(),
    seeder = require('../../utils/run_seed'),
    schema = require('../../utils/run_schema')



describe("Customer", function() {
  beforeEach(function(){
    customer = new Customer();
  })

  it("can be instantiated", function(){
    assert.equal(customer instanceof Customer, true);
  })

  it("has a 'find_all' property that is a function", function() {
    assert.equal(typeof customer.find_all, "function");
  })

  it("has a 'sort_by' property that is a function", function() {
    assert.equal(typeof customer.sort_by, "function");
  });

  describe("customer queries", function(){
    beforeEach(function(done){
      customer = new Customer();

      db_cleaner = new sqlite3.Database('db/test.db');

      db_cleaner.serialize(function(){
        db_cleaner.exec(
          "BEGIN; \
          DELETE FROM customers; \
          INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
          VALUES('Shelley Rocha', 'Wed, 29 Apr 2015 07:54:14 -0700', 'Ap #292-5216 Ipsum Rd.', 'Hillsboro', 'OR', '24309', '(322) 510-8695', 13.15), \
                ('Another Shelley Rocha', 'Wed, 30 Apr 2015 07:54:14 -0700', 'Ap #293-5216 Ipsum Rd.', 'Hillsboro', 'OR', '24310', '(322) 510-8700', 13.20); \
          COMMIT;",
          function(err) {
            db_cleaner.close();
            done();
          }
        );
      })
    })

    it("finds 'Shelly Rocha' name in the customers table", function(done) {
      customer.find_by('name', "Shelley Rocha", function(err, result){
        assert.equal(result[0].name, 'Shelley Rocha');
        done();
      });
    })

    it("displays all records from customers table", function(done) {
      customer.find_all(function(err, result) {
        assert.equal(result.length, 2);
        done();
      });
    })

    it("displays all records from 'customers' table, sorted by name with limit 2, offset 0", function(done) {
      customer.sort_by("name", 2, 0, function(err, result) {
        assert.equal(result[0].name, 'Another Shelley Rocha');
        assert.equal(result[1].name, 'Shelley Rocha');
        assert.equal(result.length, 2);
        done();
      });
    })
  })
});
