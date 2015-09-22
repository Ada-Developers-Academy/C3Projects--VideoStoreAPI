var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    Rental = require('../../rentals');

describe("rentals controller", function() {
  var rental, db_cleaner

  beforeEach(function(done) {
    rental = new Rental();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM rentals; \
        INSERT INTO rentals(check_out, check_in, due_date, overdue, movie_title, customer_id) \
        VALUES('2015-06-16', '2015-06-17', '2015-06-19', 0, 1, 'Jaws'), \
              ('2015-06-16', '2015-06-17', '2015-06-19', 1, 1, 'Alien'); COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  })
  describe("GET '/rentals'", function() {
    it("knows about the route", function(done) {
      agent.get('/rentals').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of rental objects", function() {
      agent.get('/rentals').set("Accept", "application/json")
        .expect(200, function(error, result) {
          console.log(result.body);
          assert.equal(result.body.length, 2);

          var keys = ['id', 'check_out', 'check_in', 'due_date', 'overdue', 'movie_title', 'customer_id'];
          assert.deepEqual(Object.keys(result.body[0]), keys);
          done();
        });
    });
  })
})
