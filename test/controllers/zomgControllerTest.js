// 'use strict';

var assert = require('assert');
var sqlite3 = require('sqlite3').verbose();
var zomgController = require('../../controllers/zomgController');

var customerFields = [
  // ['id', 'integer'],
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'integer'] // need to convert seeds to cents
]

describe("ZomgController", function() {
  var db = new sqlite3.Database('db/test.db');

  before(function(done) {
    db.serialize(function() {
      db.run('DROP TABLE IF EXISTS customers');
      db.run('CREATE TABLE customers (id INTEGER PRIMARY KEY)');

      // create customer table
      customerFields.forEach(function(field) {
        var fieldName = field[0];
        var fieldType = field[1];

        db.run(
          'ALTER TABLE customers ADD COLUMN '
          + fieldName
          + ' '
          + fieldType
          + ';'
        );
      });

      var defaultCustomer = {
        "name": "Shelley Rocha",
        "registered_at": "Wed, 29 Apr 2015 07:54:14 -0700",
        "address": "Ap #292-5216 Ipsum Rd.",
        "city": "Hillsboro",
        "state": "OR",
        "postal_code": "24309",
        "phone": "(322) 510-8695",
        "account_credit": 13.15
      }

      var customerStatement = db.prepare(
        "INSERT INTO customers( \
          id, name, registered_at, address, city, state, \
          postal_code, phone, account_credit) \
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);"
      );

      var desiredCustomers = 11;

      for(var i = 0; i < desiredCustomers; i++) {
        customerStatement.run(
          defaultCustomer.name,
          defaultCustomer.registered_at,
          defaultCustomer.address,
          defaultCustomer.city,
          defaultCustomer.state,
          defaultCustomer.postal_code,
          defaultCustomer.phone,
          defaultCustomer.account_credit
        );
      }
      done();

    })

  });

  // it pulls the first 10 results of all customers
  it('returns 10 customers', function(done) {
    console.log("howdy customers: " + zomgController.all_customers());
    assert.equal(zomgController.all_customers().response.length, 10);
    done();
  });

  it('fails!', function(done){
    assert.equal('p', 'a');
    done();
  });
})


// describe("Movie", function() {
//   var movie, db_cleaner
//
//   beforeEach(function(done) {
//     movie = new Movie();
//
//     db_cleaner = new sqlite3.Database('db/test.db');
//     db_cleaner.serialize(function() {
//       db_cleaner.exec(
//         "BEGIN; \
//         DELETE FROM movies; \
//         INSERT INTO movies(title, overview, release_date, inventory) \
//         VALUES('Jaws', 'Shark!', 'Yesterday', 10), \
//               ('Maws', 'Worm!', 'Yesterday', 11); \
//         COMMIT;"
//         , function(err) {
//           db_cleaner.close();
//           done();
//         }
//       );
//     });
//   })

//   it("can be instantiated", function() {
//     assert(movie instanceof Movie);
//   })
//
//   describe("instance methods", function() {
//     it("can find a movie by id", function(done){
//       movie.find_by("id", 1, function(err, res) {
//         assert.equal(err, undefined);
//         assert(res instanceof Array);
//         assert.equal(res.length, 1);
//         assert.equal(res[0].id, 1);
//         done();
//       })
//     })
//
//     it("can find a movie by title", function(done) {
//       movie.find_by("title", "Jaws", function(err, res) {
//         assert.equal(err, undefined);
//         assert(res instanceof Array);
//         assert.equal(res.length, 1);
//         assert.equal(res[0].title, 'Jaws');
//         done();
//       })
//     })
//
//     it("can save changes to a movie", function(done) {
//       movie.find_by("title", "Jaws", function(err, res) {
//         var original_title = res[0].title;
//         var id = res[0].id;
//         movie.save({title: "Jaws 2: Jawsier", id: id}, function(err, res) {
//           assert.equal(err, undefined);
//           assert.equal(res.inserted_id, 0); //it didn't insert any records
//           assert.equal(res.changed, 1); //it updated one record
//           done();
//         })
//       })
//     });
//
//     it("can save a new movie to the database", function(done) {
//       var data = {
//         title: "RoboJaws",
//         overview: "Jaws is hunted by RoboJaws",
//         release_date: "Tomorrow",
//         inventory: 10
//       }
//
//       movie.create(data, function(err, res) {
//         assert.equal(res.inserted_id, 3); //it inserted a new record
//         assert.equal(res.changed, 1); //one record was changed
//
//         movie.find_by("title", "RoboJaws", function(err, res) {
//           assert.equal(res.length, 1);
//           assert.equal(res[0].title, 'RoboJaws'); //we found our new movie
//           done();
//         })
//       })
//     });
//   })
// })
//
//
