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
    it("can find all customers", function(done){
      customer.find_all(function(err, res){
        assert.equal(err, undefined);
        assert.equal(res.length, 2);
        done();
      });
    });

    it("can find a customer by id", function(done){
      customer.find_by("id", 1, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Object);
        assert.equal(res.id, 1);
        done();
      });
    });

    it("can return a subset of customers sorted by name", function(done){
      var queries = [1, 0]
      customer.subset("name", queries, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res[0].id, 1);
        assert.equal(res[0].name, "Dana Scully")
        done();
      });
    });

    it("can return a subset of customers sorted by registered_at", function(done){
      var queries = [1, 0]
      customer.subset("registered_at", queries, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res[0].id, 2);
        assert.equal(res[0].name, "Fox Mulder")
        done();
      });
    });

    it("can return a subset of customers sorted by postal_code", function(done){
      var queries = [1, 1]
      customer.subset("postal_code", queries, function(err, res) {
        assert.equal(err, undefined);
        assert(res instanceof Array);
        assert.equal(res[0].id, 2);
        assert.equal(res[0].name, "Fox Mulder")
        done();
      });
    });
  }); // end of describe instance methods

  describe("class methods", function() {
    it("can create a new customer in the database", function(done) {
      var columns = ['name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone'];
      var values = ["Ratboy", "Wed, 24 Feb 2012 18:22:18 -0700", "55 Skinner Ave.", 
        "Vancouver", "BC", "93840", "(385) 948-9282"];

      customer.create(columns, values, function(err, res) {
        assert.equal(res.inserted_id, 3); //it inserted a new record

        customer.find_by("name", "Ratboy", function(err, res) {
          assert.equal(res.name, 'Ratboy'); //we found our new customer
          done();
        });
      });
    });
  });

    // it("can save changes to a customer", function(done) {
    //   customer.find_by("name", "Fox Mulder", function(err, res) {
    //     var original_name = res.name;
    //     var id = res.id;
    //     customer.save({name: "Foxy Mulder", id: id}, function(err, res) {
    //       assert.equal(err, undefined);
    //       assert.equal(res.inserted_id, 0); //it didn't insert any records
    //       assert.equal(res.changed, 1); //it updated one record
    //       done();
    //     })
    //   })
    // });

});
