var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose()
    request = require('supertest'),
    app = require('../../app'),
    agent = request.agent(app);

describe("/movies", function() {
  var test_db;

  beforeEach(function(done) {

    test_db = new sqlite3.Database('db/test.db');
    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Amelie', 'sad French girl. you know', '2005-12-12', 5), \
              ('Alien', 'something about aliens', '1997-11-11', 2), \
              ('Jaws', 'something about a shark', '1999-10-10', 3), \
              ('Moneyball', 'something about baseball', '2007-11-11', 6); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  describe("GET '/'", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array of movie objects", function(done) {
      movie_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 4);

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory'];
        assert.deepEqual(Object.keys(res.body[0]), keys);
        done();
      })
    })
  })

  describe("GET /movies/:title", function() {
    var movie_request;

    it("can find amelie and show that 2 are checked out", function(done) {
      movie_request = agent.get('/movies/amelie').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['title', 'overview', 'inventory'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].title, 'Amelie');
          assert.equal(res.body[1].Available, 3);
          done();
        });
    })

    it("can find moneyball and show that none are checked out", function(done) {
      movie_request = agent.get('/movies/moneyball').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['title', 'overview', 'inventory'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].title, 'Moneyball');
          assert.equal(res.body[1].Available, 6);
          done();
        });
    })
  })

  describe("GET /movies/title/:records/:offset", function() {
    var movie_request;

    it("returns n records of movies sorted by title with n offset", function(done) {
      movie_request = agent.get('/movies/title/2/2').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          assert.equal(res.body[0].title, 'Jaws');
          assert.equal(res.body[1].title, 'Moneyball');
          done();
        });
    })
  })

  describe("GET /movies/released/:records/:offset", function() {
    var movie_request;

    it("returns n records of movies sorted by most recent release date with n offset", function(done) {
      movie_request = agent.get('/movies/released/1/0').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 1);

          assert.equal(res.body[0].title, 'Moneyball');
          done();
        });
    })
  })
})
