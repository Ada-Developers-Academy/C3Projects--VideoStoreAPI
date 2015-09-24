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

   db_cleaner.exec("BEGIN; DELETE FROM customers; DELETE FROM rentals; INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) VALUES('Mulder', '2013-12-23', '123', 'DC', 'DC', '834885', '49583', 5), ('Scully', '2015-09-16', '12 blah','DC', 'DC', '2342', '534', 7); INSERT INTO rentals(movie_id, customer_id, returned_date, due_date, checked_out) VALUES(1, 1, '', '2015-09-10', '2015-09-01'), (2, 2, '2015-09-30', '2015-10-01', '2015-09-15'); COMMIT;", function(err) {

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

    it("can find a customer's current rentals", function(done) {
      customer.customer_rentals(1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].title, 'X-files: I want to believe');

        done();
      });
    });

    it("can find a customer's past rentals", function(done) {
      customer.customer_history(2, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].title, 'The Lone Gunmen');

        done();
      });
    });
  });
});
