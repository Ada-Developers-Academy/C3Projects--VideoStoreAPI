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
                ('09-25-2015', '09-25-2015', '1', '2.50', '5', '2', '4'), \
                ('09-19-2015', 'nil', '6', '2.50', null, '1', '6'), \
                ('09-18-2015', 'nil', '1', '2.50', null, '2', '5'); \
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
        assert.equal(result.length, 6);
        done();
      });
    });
  })
});
