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
        DELETE FROM rentals; \
        INSERT INTO movies(title, overview, release_date, inventory_total, inventory_avail) \
        VALUES('Bring It On', 'Cheerleaders duel it out.', '2000-08-22', 10, 10), \
              ('Maws', 'Worm!', '1998-02-11', 11, 11), \
              ('Bring It On 2', 'Moar cheerleaders', '1990-04-12', 12, 12); \
        INSERT INTO rentals(customer_id, name, movie_id, title, checkout_date, due_date, return_date) \
        VALUES(1, 'Sarah', 1, 'Bring It On', '2015-07-14', '2015-07-21', '2015-07-21'), \
              (1, 'Sarah', 2, 'Maws', '2015-07-16', '2015-07-23', '2015-07-19'), \
              (1, 'Sarah', 3, 'Bring It On 2', '2015-07-01', '2015-07-08', '2015-07-09'), \
              (2, 'Jane', 1, 'Bring It On', '2015-07-14', '2015-07-21', '2015-07-15'), \
              (2, 'Jane', 2, 'Maws', '2015-07-16', '2015-07-23', '2015-07-17'), \
              (2, 'Jane', 3, 'Bring It On 2', '2015-07-01', '2015-07-08', '2015-07-02'); \
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
        assert.equal(result.body.movies.length, 3); //the tesb_db inserted 2 records

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory_total', 'inventory_avail'];
        assert.deepEqual(Object.keys(result.body.movies[0]), keys);
        done();
      })
    })

    it("can be ordered by title", function(done) {
      movie_request_title = agent.get('/movies?order_by=title').set('Accept', 'application/json');
      
      movie_request_title.expect(200, function(error, result) {
        assert.equal(result.body.movies[0].title, "Bring It On");
        assert.equal(result.body.movies[1].title, "Bring It On 2");
        assert.equal(result.body.movies[2].title, "Maws");
        done();
      })
    })

    it("can be ordered by release_date", function(done) {
      movie_request_date = agent.get('/movies?order_by=release_date').set('Accept', 'application/json');

      movie_request_date.expect(200, function(error, result) {
        assert.equal(result.body.movies[0].release_date, "1990-04-12");
        assert.equal(result.body.movies[1].release_date, "1998-02-11");
        assert.equal(result.body.movies[2].release_date, "2000-08-22");
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

  describe('GET /:title', function() {
    var movie_request;

    it("responds with json", function(done) {
      movie_request = agent.get('/movies/maws').set('Accept', 'application/json');

      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it('can find a specific movie', function(done) {
      movie_request = agent.get('/movies/maws').set('Accept', 'application/json');

      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.movie[0].title, 'Maws');
        done();
      })
    })

    it('returns all partial matches when searching by title', function(done) {
      movie_request = agent.get('/movies/bring').set('Accept', 'application/json');

      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.movie.length, 2);
        done();
      })
    })

    it('can order by other columns if there are multiple results', function(done) {
      movie_request = agent.get('/movies/bring?order_by=release_date').set('Accept', 'application/json');

      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.movie[0].title, "Bring It On 2");
        done();
      })
    })  
  })

})
