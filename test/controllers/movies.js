var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose(),
    request = require('supertest'),
    app     = require('../../app'),
    movie_controller  = require('../../controllers/movies'),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {
  var db_cleaner;

  beforeEach(function(done) {

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory, num_available) \
        VALUES('Jaws', 'Shark!', '2015-01-01', 10, 8), \
              ('Maws', 'Worm!', '2015-01-01', 11, 4), \
              ('Claws', 'Cat!', '2015-01-01', 12, 5), \
              ('Paws', 'Bear!', '2015-01-01', 13, 10), \
              ('Gauze', 'Ouch!', '2015-01-01', 14, 10); \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('BeetleJaws', '2015-01-01', '123 street', 'Burlington', \
        'WA', '98233', '(908) 949-6758', 5.25), \
        ('JuiceMaws', '2010-10-10', '123 Lane', 'Mt. Vernon', \
        'WA', '11111', '(908) 949-6758', 10.00); \
        DELETE FROM rentals; \
        INSERT INTO rentals(checkout_date, return_date, movie_id, customer_id, checked_out) \
        VALUES('2015-09-23', '2015-09-30', 1, 1, 'true', \
              ('2015-09-16', '2015-09-23', 2, 2, 'false'); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("movie instance methods", function() {
      var movie_keys;
      var customer_keys;

      beforeEach(function(done) {
        movie_keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'num_available'];
        customer_keys = ['name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
        done();
      });

    context("GET /movies", function() {

      it("responds with json", function(done) {
        var movie_request = agent.get('/movies').set('Accept', 'application/json');
        movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });

      it('knows about the route', function(done) {
        var movie_request = agent.get('/movies').set('Accept', 'application/json');
        movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err,res) {
          assert.equal(err, undefined);
          done();
          });
      });

      it("returns an array of movie objects", function(done) {
        var movie_request = agent.get('/movies').set('Accept', 'application/json');
        movie_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 5);
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
      });
    });

    context("GET /movies/:title ", function() {

      it("can find Jaws", function(done) {
        movie_keys;
        var movie_request = agent.get('/movies/Jaws').set('Accept', 'application/json');
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), movie_keys);
            assert.equal(result.body[0].title, 'Jaws');
            done();
          });
        });
      });


    context("GET /movies/:title/history ", function() {
      it("can see Jaws customer history", function(done) {
       var movie_request = agent.get('/movies/Jaws/history').set('Accept', 'application/json');
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body[0].name, 'BeetleJaws');
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), customer_keys);
            done();
          });
        });
      });

    context("GET /movies/:column/:p ", function() {
      it.only("sorted movie column", function(done) {
       var movie_request = agent.get('/movies/title/1/1').set('Accept', 'application/json');
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), movie_keys);
            assert.equal(result.body[0].title, 'Claws');
            done();
          });
        });
      });
//db run/execute INSERT new values ...db serialize
    context("GET /movies/:title/customers ", function() {
      it("can see Jaws customer history", function(done) {
       var movie_request = agent.get('/movies/Jaws/history').set('Accept', 'application/json');
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), customer_keys);
            assert.equal(result.body[0].name, 'Curran Stout');
            done();
          });
      });
    });
  });
});
