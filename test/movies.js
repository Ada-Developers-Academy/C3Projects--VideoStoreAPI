var assert = require('assert'),
    Movie  = require('../models/movie'),
    sqlite3 = require('sqlite3').verbose(),
    request = require('supertest'),
    app     = require('../app'),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {
  var movie, db_cleaner;

  beforeEach(function(done) {
    movie = new Movie();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory, num_available) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10, 8), \
              ('Maws', 'Worm!', 'Yesterday', 11, 4), \
              ('Claws', 'Cat!', 'Yesterday', 12), \
              ('Paws', 'Bear!', 'Yesterday', 13), \
              ('Gauze', 'Ouch!', 'Yesterday', 14); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("movie instance methods", function() {
    context("GET /movies", function() {
      var movie_request;
      var keys;

      beforeEach(function(done) {
        movie_request = agent.get('/movies').set('Accept', 'application/json');
        keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'num_available'];
        done();
      });

      it("responds with json", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });

      it('knows about the route', function(done) {
      movie_request
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err,res) {
        assert.equal(err, undefined);
        done();
        });
      });

      it("returns an array of movie objects", function(done) {
        movie_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 100);
          assert.deepEqual(Object.keys(result.body[0]), keys);
          done();
        });
      });
    });

    context("GET /movies/:title ", function() {
      var keys;
      beforeEach(function(done) {
        keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'num_available'];
        done();
      });

      it("can find Jaws", function(done) {
       var movie_request = agent.get('/movies/Jaws').set('Accept', 'application/json');
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), keys);
            assert.equal(result.body[0].title, 'Jaws');
            done();
          });
        });
      });

    context("GET /movies/:title/history ", function() {
      it("can see Jaws customer history", function(done) {
       var movie_request = agent.get('/movies/Jaws/history').set('Accept', 'application/json');
          done();
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), keys);
            assert.equal(result.body[0].title, 'Jaws');
            done();
          });
        });
      });

    context("GET /movies/:column/:p ", function() {
      it("can see Jaws customer history", function(done) {
       var movie_request = agent.get('/movies/title/1').set('Accept', 'application/json');
          done();
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), keys);
            assert.equal(result.body[0].title, 'Jaws');
            done();
          });
        });
      });

    context("GET /movies/:title/customers ", function() {
      it("can see Jaws customer history", function(done) {
       var movie_request = agent.get('/movies/Jaws/history').set('Accept', 'application/json');
          done();
        movie_request
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result) {
            assert.equal(result.body.length, 1);
            assert.deepEqual(Object.keys(result.body[0]), keys);
            assert.equal(result.body[0].title, 'Jaws');
            done();
          });
      });
    });
  });
});
