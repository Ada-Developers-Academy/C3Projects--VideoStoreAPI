var request = require('supertest'),
assert = require('assert'),
app = require('../../app'),
sqlite3 = require('sqlite3').verbose(),
agent = request.agent(app);

describe("Endpoints under /movies", function() {
  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory, copies_available) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10, 10), \
              ('Maws', 'Worm!', 'Yesterday', 11, 11); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

describe("movies controller", function() {
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
      console.log("result is ", result);
      console.log(err);
      assert.equal(result.body.length, 2);

      var keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'copies_available'];
      assert.deepEqual(Object.keys(result.body[0]), keys);
      done();
     });
    });
  });
  });
});
