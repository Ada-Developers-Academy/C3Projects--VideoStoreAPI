var request = require('supertest'),
assert = require('assert'),
app = require('../../app'),
sqlite3 = require('sqlite3').verbose(),
agent = request.agent(app);

describe("movies controller", function() {

  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory, copies_available) \
        VALUES('Jaws', 'Shark!', '2015-09-22', 10, 10), \
              ('Maws', 'Worm!', '2015-09-22', 11, 11); \
        COMMIT;", function(err) {

        }
      );

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
        DELETE FROM movie_copies; \
        INSERT INTO movie_copies(movie_id) \
        VALUES(1), \
              (1), \
              (2), \
              (2); \
        COMMIT;", function(err) {

        }
      );

      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM rentals; \
        INSERT INTO rentals(customer_id, movie_copy_id, checkout_date, return_date, return_status, cost) \
        VALUES(1, 1, '2015-09-22', '2015-10-01', 0, 5), \
              (1, 2, '2015-09-12', '2015-09-21', 1, 5), \
              (2, 1, '2015-09-22', '2015-10-01', 0, 5), \
              (2, 3, '2015-09-22', '2015-10-01', 0, 5), \
              (2, 1, '2015-09-12', '2015-09-21', 1, 5); \
        COMMIT;", function(err) {
          db_cleaner.close();
          done();
        }
      );
    }); // end serialize
  });

describe("GET '/'", function() {
  it("knows about the route", function(done) {
    agent.get('/movies').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);
       // console.log(err);
      done();
      });
  });

  it("returns an array of movie objects", function(done) {
   agent.get('/movies').set('Accept', 'application/json')
     .expect(200, function(err, result) {
      assert.equal(result.body.length, 2);

      var keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'copies_available'];
      assert.deepEqual(Object.keys(result.body[0]), keys);
      done();
     });
   }); // returns array objects

  it("knows about the route", function(done) {
    agent.get('/movies/Jaws').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);
       // console.log(err);
      done();
      });
  });

  it("returns the movie object", function(done) {
   agent.get('/movies/Jaws').set('Accept', 'application/json')
     .expect(200, function(err, result) {
      assert.equal(result.body.length, 1);

      var keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'copies_available'];
      assert.deepEqual(Object.keys(result.body[0]), keys);
      done();
     });
   }); // returns array objects

  it("knows about the route", function(done) {
    agent.get('/movies/Jaws/current_renters/id').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);
       // console.log(err);
      done();
      });
  });

  it("returns the movie object", function(done) {
   agent.get('/movies/Jaws/current_renters/id').set('Accept', 'application/json')
     .expect(200, function(err, result) {
      assert.equal(result.body.length, 2);

      var keys = ['name'];
      assert.deepEqual(Object.keys(result.body[0]), keys);
      done();
     });
   }); // returns array objects

  it("knows about the route", function(done) {
    agent.get('/movies/release/2015').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);
       // console.log(err);
      done();
      });
  });

  it("returns the movie object", function(done) {
   agent.get('/movies/release/2015').set('Accept', 'application/json')
     .expect(200, function(err, result) {
      assert.equal(result.body.length, 2);

      var keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'copies_available'];
      assert.deepEqual(Object.keys(result.body[0]), keys);
      done();
     });
   }); // returns array objects


 }); // describe get
}); // describe movies
