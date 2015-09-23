var request = require('supertest'),
assert = require('assert'),
app = require('../../app'),
sqlite3 = require('sqlite3').verbose(),
agent = request.agent(app);

describe("customers controller", function() {

  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Shelley Rocha', '2015-09-21', '123 Nope St', 'Seattle', 'WA', '98104', '(000) 000-000', '100'), \
              ('Billy Rocha', '2015-09-21', '123 Nope St', 'Seattle', 'WA', '98104', '(000) 000-000', '100'); \
        COMMIT;", function(err) {

        }
      );

      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Jaws', 'Shark!', '2015-09-22', 1), \
              ('Maws', 'Worm!', '2015-09-22', 1); \
        COMMIT;", function(err) {

        }
      );

      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movie_copies; \
        INSERT INTO movie_copies(movie_id, is_available) \
        VALUES(1, 0), \
              (2, 1); \
        COMMIT;", function(err) {

        }
      );

      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM rentals; \
        INSERT INTO rentals(customer_id, movie_copy_id, checkout_date, return_date, return_status, cost) \
        VALUES(1, 1, '2014-09-22', '2014-10-01', 0, 5), \
              (2, 1, '2015-09-12', '2015-09-21', 1, 5); \
        COMMIT;", function(err) {
          db_cleaner.close();
          done();
        }
      );

    }); // end serialize
  }); // end beforeEach function

describe("GET '/'", function() {
  it("knows about the route", function(done) {
    agent.get('/rentals/overdue').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);

      done();
    });
  });

  it("returns an array of movie objects", function(done) {
   agent.get('/rentals/overdue').set('Accept', 'application/json')
     .expect(200, function(err, result) {
      assert.equal(result.body.length, 1);

      var keys = ['name', 'title', 'id'];
      assert.deepEqual(Object.keys(result.body[0]), keys);

      done();
     });
    }); // returns array objects
  }); // end describe 'get' block

describe("POST '/'", function() {
  it("knows about the route", function(done) {
    agent.post('/rentals/1/Maws').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);

      done();
    });
  });

  it("returns the rental object", function(done) {
   agent.post('/rentals/1/Maws').set('Content-Type', 'application/json')
     .expect(200, function(err, res) {
      console.log("RESPONSE ", res.body );
      assert.equal(res.body.movie_copy_id, 2);

      var keys = ['id', 'movie_copy_id', 'customer_id', 'checkout_date', 'return_date', 'return_status', 'cost'];
      assert.deepEqual(Object.keys(res.body), keys);

      done();
     });
   }); // returns array objects
  }); // end post block
}); // end describe 'rentals controller' block
