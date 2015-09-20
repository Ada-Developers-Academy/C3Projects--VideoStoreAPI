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
        INSERT INTO customers (name, registered_at, address, city, state, \
        postal_code, phone, account_credit) \
        VALUES ('Dana Scully', 'Wed, 16 Apr 2014 21:40:20 -0700', \
            'P.O. Box 887, 4257 Lorem Rd.', 'Columbus', 'Ohio', '43201', \
            '(371) 627-1105', 1234), \
        ('Fox Mulder', 'Fri, 10 Jul 2015 15:23:06 -0700', '152-525 Odio St.', \
            'Seattle', 'Washington', '98109', '(206) 329-4928', 293); \
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
    it("can find a customer by id", function(done){
      customer.find_by("id", 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Object);
        assert.equal(res.id, 1);
        done();
      })
    })

    // it("can find a customer by title", function(done) {
    //   customer.find_by("title", "Jaws", function(err, res) {
    //     assert.equal(err, undefined);
    //     assert(res instanceof Array);
    //     assert.equal(res.length, 1);
    //     assert.equal(res[0].title, 'Jaws');
    //     done();
    //   })
    // })

    // it("can save changes to a customer", function(done) {
    //   customer.find_by("title", "Jaws", function(err, res) {
    //     var original_title = res[0].title;
    //     var id = res[0].id;
    //     customer.save({title: "Jaws 2: Jawsier", id: id}, function(err, res) {
    //       assert.equal(err, undefined);
    //       assert.equal(res.inserted_id, 0); //it didn't insert any records
    //       assert.equal(res.changed, 1); //it updated one record
    //       done();
    //     })
    //   })
    // });

    // it("can save a new customer to the database", function(done) {
    //   var data = {
    //     title: "RoboJaws",
    //     overview: "Jaws is hunted by RoboJaws",
    //     release_date: "Tomorrow",
    //     inventory: 10
    //   }

    //   customer.create(data, function(err, res) {
    //     assert.equal(res.inserted_id, 3); //it inserted a new record
    //     assert.equal(res.changed, 1); //one record was changed

    //     customer.find_by("title", "RoboJaws", function(err, res) {
    //       assert.equal(res.length, 1);
    //       assert.equal(res[0].title, 'RoboJaws'); //we found our new customer
    //       done();
    //     })
    //   })
    // });
  })
})
