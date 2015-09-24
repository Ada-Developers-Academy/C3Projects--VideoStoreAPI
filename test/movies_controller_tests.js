var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("/movies endpoints", function() {
  var test_db;

  beforeEach(function(done) {
    test_db = new sqlite3.Database('db/test.db');

    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory_total, inventory_avail) \
        VALUES('Bring It On', 'Cheerleaders duel it out.', '2000-08-22', 10, 10), \
              ('Maws', 'Worm!', '1998-02-11', 11, 11); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  describe("GET /", function() {
    var movie_request, movie_request_title, movie_request_date;

    it("responds with json", function(done) {
      movie_request = agent.get('/movies').set('Accept', 'application/json');

      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array of movie objects", function(done) {
      movie_request = agent.get('/movies').set('Accept', 'application/json');

      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.movies.length, 2); //the tesb_db inserted 2 records

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory_total', 'inventory_avail'];
        assert.deepEqual(Object.keys(result.body.movies[0]), keys);
        done();
      })
    })

    it("can be ordered by title", function(done) {
      movie_request_title = agent.get('/movies?order_by=title').set('Accept', 'application/json');
      
      movie_request_title.expect(200, function(error, result) {
        assert.equal(result.body.movies[0].title, "Bring It On");
        assert.equal(result.body.movies[1].title, "Maws");
        done();
      })
    })

    it("can be ordered by release_date", function(done) {
      movie_request_date = agent.get('/movies?order_by=release_date').set('Accept', 'application/json');

      movie_request_date.expect(200, function(error, result) {
        assert.equal(result.body.movies[0].release_date, "1998-02-11");
        assert.equal(result.body.movies[1].release_date, "2000-08-22");
        done();
      })
    })

    it("can determine the number of returned records per page and which page is returned", function(done) {
      movie_request = agent.get('/movies?number=1&page=2').set('Accept', 'application/json');

      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.movies.length, 1);
        assert.equal(result.body.movies[0].title, "Maws");
        done();
      })
    })
  })
})
