var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("/movies endpoints", function() {
  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory_total, inventory_avail) \
        VALUES('Bring It On', 'Cheerleaders duel it out.', '2000-08-22', 10, 10), \
              ('Maws', 'Worm!', '2010-02-11', 11, 11); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  })

  describe("GET /", function() {
    var movie_request, movie_request_title, movie_request_date;

    beforeEach(function(done) {
      movie_request = agent.get('/movies').set('Accept', 'application/json');
      movie_request_title = agent.get('/movies?order_by=title').set('Accept', 'application/json');
      movie_request_date = agent.get('/movies?order_by=date').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array of movie objects", function(done) {
      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.length, 2); //the db_cleaner inserted 2 records

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory_total', 'inventory_avail'];
        assert.deepEqual(Object.keys(result.body[0]), keys);
        done();
      })
    })

    it("can be ordered by title", function(done) {
      movie_request_title.expect(200, function(error, result) {
        assert.equal(result.body[0].title, "Bring It On");
        assert.equal(result.body[1].title, "Maws");
        done();
      })
    })

    // it("can be ordered by release_date")

    // also can limit number of returned records
    // pagination
  })
})
