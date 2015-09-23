var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("movies controller", function() {
  // beforeEach(function(done) {
  //   db_cleaner = new sqlite3.Database('db/test.db');
  //   db_cleaner.serialize(function() {
  //     db_cleaner.exec(
  //       "BEGIN; \
  //       DELETE FROM movies; \
  //       INSERT INTO movies(title, overview, release_date, inventory) \
  //       VALUES('Jaws', 'Shark!', 'Yesterday', 10), \
  //             ('Maws', 'Worm!', 'Yesterday', 11); \
  //       COMMIT;"
  //       , function(err) {
  //         db_cleaner.close();
  //         done();
  //       }
  //     );
  //   });
  // })

  describe("GET ':title/customers/current'", function() {

    beforeEach(function(done) {
      movie_request = agent.get('/movies/Jaws/customers/current').set('Accept', 'application/json');
      done();
    })

    it("knows about the route", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200);
      done();
    })

    it.only("returns an array", function(done) {
      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.length, 2);

        var keys = ['id', 'name', 'phone'];
        console.log(Object.keys(result.body[0]));
        assert.deepEqual(Object.keys(result.body[0]), keys);
      })
      done();
    })
  })
})
