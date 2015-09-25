var assert = require("assert"),
    Rental = require('../../models/rental'),
    sqlite3 = require('sqlite3').verbose();


describe("Rental", function() {
  beforeEach(function(){
    rental = new Rental();
  })

  it("can be instantiated", function(){
    assert.equal(rental instanceof Rental, true);
  })

  it("has a 'customersRentalHistory' property that is a function", function() {
    assert.equal(typeof rental.customersRentalHistory, "function");
  })

  // it("has a 'sort_by' property that is a function", function() {
  //   assert.equal(typeof movie.sort_by, "function");
  // });

  describe("rentals queries", function(){
    beforeEach(function(done){
      rental = new Rental();

      db_cleaner = new sqlite3.Database('db/test.db');

      db_cleaner.serialize(function(){
        db_cleaner.exec(
          "BEGIN; \
          DELETE FROM rentals; \
          INSERT INTO rentals(checkout_date, returned_date, rental_time, cost, total, customer_id, movie_id) \
          VALUES('09-22-2015', '09-25-2015', '3', '2.50', '5', '1', '1'), \
                ('09-23-2015', '09-26-2015', '3', '2.50', '5', '2', '2'), \
                ('09-24-2015', '09-30-2015', '6', '2.50', '5', '1', '3'), \
                ('09-25-2015', '09-25-2015', '1', '2.50', '5', '2', '4'); \
          COMMIT;",
          function(err) {
            db_cleaner.close();
            done();
          }
        );
      })
    })

    it("displays all customers rental history", function(done) {
      rental.customersRentalHistory(function(err, result){
        assert.equal(result[0].name, 'Another Shelley Rocha');
        assert.equal(result[0].checkout_date, '09-25-2015');
        assert.equal(result[0].returned_date, '09-25-2015');
        assert.equal(result[0].rental_time, 1);
        assert.equal(result.length, 4);
        done();
      });
    });

    // it("displays all records from movies table", function(done) {
    //   movie.find_all(function(err, result) {
    //     assert.equal(result.length, 4);
    //     done();
    //   });
    // })
    //
    // it("displays all records from 'movies' table, sorted by title with limit 2", function(done) {
    //   movie.sort_by("title", 2, 0, function(err, result) {
    //     assert.equal(result[0].title, 'Aws');
    //     assert.equal(result[1].title, 'Jaws');
    //     assert.equal(result.length, 2);
    //     done();
    //   });
    // })
    //
    // it("displays 10 available 'Jaws' movie", function(done) {
    //   movie.available("Jaws", function(err, result) {
    //     assert.equal(result[0].title, 'Jaws');
    //     assert.equal(result[0].available, 10);
    //     done();
    //   });
    // })
  })
});
