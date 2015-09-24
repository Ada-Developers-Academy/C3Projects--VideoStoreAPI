var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose(),
    Rental = require('../../models/rentals'),
    Customer = require('../../models/customers');

describe("Rental model", function() {
  var test_db, rental, customer;

  beforeEach(function(done) {
    rental = new Rental();
    customer = new Customer();

    test_db = new sqlite3.Database('db/test.db');
    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM rentals; \
        INSERT INTO rentals(checkout_date, due_date, return_date, overdue, movie_title, customer_id) \
        VALUES('2015-09-14', '2015-09-30', null, 0, 'Amelie', 1), \
              ('2015-09-11', '2015-09-14', null, 0, 'Amelie', 2), \
              ('2015-09-09', '2015-09-12', '2015-09-14', 1, 'Jaws', 1), \
              ('2014-09-10', '2014-09-13', '2014-09-11', 0, 'Jaws', 2), \
              ('2015-09-11', '2015-09-14', '2015-09-13', 0, 'Alien', 1), \
              ('2015-09-20', '2015-09-30', null, 0, 'Jaws', 2); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  it('can be instantiated', function(){
    assert(rental instanceof Rental);
  })

  describe("instance methods", function() {
    it("can find customers who have currently checked out any movie", function(done) {
      rental.customers_current(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].name, 'Jim');
        done();
      })
    })

    it("can find customers who have currently checked out a given movie", function(done) {
      rental.checkout_history("Jaws", "IS NULL", "", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 1);

        assert.equal(res[0].name, 'Jack');
        done();
      })
    })

    it("can find customers who have previously checked out a given movie by checkout date", function(done) {
      rental.checkout_history("Jaws", "IS NOT NULL", " ORDER BY rentals.checkout_date DESC", function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].checkout_date, '2015-09-09');
        assert.equal(res[1].checkout_date, '2014-09-10');

        done();
      })
    })

    it("can find customers who have previously checked out a given movie by id", function(done) {
      rental.checkout_history('Jaws', 'IS NOT NULL', ' ORDER BY rentals.customer_id', function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].id, 1);
        assert.equal(res[1].id, 2);

        done();
      })
    })

    it("can find customers who have previously checked out a given movie by customer name", function(done) {
      rental.checkout_history('Jaws', 'IS NOT NULL', ' ORDER BY customers.name', function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].name, 'Jack');
        assert.equal(res[1].name, 'Jim');

        done();
      })
    })

    it("can checkout a given movie to a customer by id", function(done) {
      rental.checkoutMovie('Amelie', 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Object);

        assert.equal(res.message, 'Checkout successful');
        assert.equal(res.movie_title, 'Amelie');
        assert.equal(res.customer_id, 1);

        done();
      })
    })

    it("can checkin a given movie to a customer by id", function(done) {
      rental.checkInMovie('Amelie', 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Object);

        assert.equal(res.message, 'Check-in successful');
        assert.equal(res.movie_title, 'Amelie');
        assert.equal(res.customer_id, 1);

        done();
      })
    })

    it("returns customer ids and names for all customers with overdue movies", function(done) {
      rental.overdue(function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res.length, 2);

        assert.equal(res[0].movie_title, 'Amelie');

        done();
      })
    })
  })
})
