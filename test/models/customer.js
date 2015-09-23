var assert = require('assert'),
  Customer = require('../../models/customer'),
  sqlite3 = require('sqlite3').verbose();

describe('Customer', function() {
  var customer,
   db_cleaner;

 beforeEach(function(done) {
   customer = new Customer();

   db_cleaner = new sqlite3.Database('db/test.db');
   db_cleaner.serialize(function() {
     db_cleaner.exec("BEGIN; DELETE FROM customers; INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) VALUES('Mulder', 'yesterday', '123', 'DC', 'DC', '834885', '49583', 5), ('Scully', 'last week', '12 blah','DC', 'DC', '2342', '534', 7); COMMIT;", function(err) {
         db_cleaner.close();
         done();
       }
     );
   });
 });

  it("can be instantiated", function(){
    assert(customer instanceof Customer);
  });

  describe("instance methods", function() {
    it("can find all customers", function(done) {
      customer.find_all(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].name, 'Mulder');
        assert.equal(res[1].name, 'Scully');

        done();
      });
    });

    it("can find a subset of customers", function(done) {
      customer.find_subset('name', 1, 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].name, 'Scully');

        done();
      });
    });
  });
});
