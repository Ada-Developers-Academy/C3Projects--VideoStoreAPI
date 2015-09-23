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
              ('Maws', 'Worm!', 'Yesterday', 11, 4); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("movie instance methods", function() {
    context("GET #INDEX", function() {
      var movie_request;
      beforeEach(function(done) {
        movie_request = agent.get('/movies').set('Accept', 'application/json');
        done();
      });
      
      it("can be instantiated", function() {
        assert(movie instanceof Movie);
      });

      it("responds with json", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });

      it("retrieves all movie records", function(done) {
        movie.find_all(function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 100);
          assert.equal(res[0].title, 'Psycho');
          done();
        });
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
          console.log(result.body);
          assert.equal(result.body.length, 100);
          var keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'num_available'];
          assert.deepEqual(Object.keys(result.body[0]), keys);
          done();
        });
      });
    });
    context("POST", function() {
      it ("can make a post", function(done) {
        agent.post('/movies').set('Accept', 'application/json')
        .field('title', 'RoboJaws')
        .field('release_date', 'Tomorrow')
        .expect();
        done();
      });
    });

    context("GET #movies_by_customer_history", function() {
      it("retrieves all past movie records from that customer", function(done) {
        movie_request
        movie.movies_by_customer_history(function(err,res) {
          done();
        });
      });
    });
  });
});
