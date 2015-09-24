var assert = require('assert'),
  Rental = require('../../models/rental'),
  sqlite3 = require('sqlite3').verbose();

describe('Rental', function() {
  var rental,
   db_cleaner;

 beforeEach(function(done) {
   rental = new Rental();

   db_cleaner = new sqlite3.Database('db/test.db');
   db_cleaner.serialize(function() {
     db_cleaner.exec("BEGIN; DELETE FROM customers; DELETE FROM rentals; INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) VALUES('Mulder', 'yesterday', '123', 'DC', 'DC', '834885', '49583', 5), ('Scully', 'last week', '12 blah','DC', 'DC', '2342', '534', 7); INSERT INTO rentals(movie_id, customer_id, returned_date, due_date, checked_out) VALUES(1, 1, '', '2015-09-10', '2015-09-01'), (2, 2, '2015-10-01', '2015-09-29', '2015-09-19'); COMMIT;", function(err) {
         db_cleaner.close();
         done();
       }
     );
   });
 });

  it("can be instantiated", function() {
    assert(rental instanceof Rental);
  });

  describe("instance methods", function() {
    it("can find details of a movie", function(done) {
      rental.movie_details("X-files: I want to believe", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].overview, 'Mulder and Scully rock it');
        done();
      });
    });

    it("can find current customers of a rental", function(done) {
      rental.customers("X-files: I want to believe", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].name, 'Mulder');
        done();
      });
    });

    it("can find customers with overdue accounts", function(done) {
      rental.overdue("The Lone Gunmen", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].name, 'Scully');
        done();
      });
    });
  });
});
