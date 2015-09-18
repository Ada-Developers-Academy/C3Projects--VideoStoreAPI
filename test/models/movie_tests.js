var assert = require("assert"),
    Movie = require('../../models/movie'),
    sqlite3 = require('sqlite3').verbose();


describe("Movie", function() {
  beforeEach(function(){
    movie = new Movie();
  })

  it("can be instantiated", function(){
    assert.equal(movie instanceof Movie, true);
  })

  it("has a find_by property that is a function", function() {
    assert.equal(typeof movie.find_by, "function");
  });

  describe("movie queries", function(){
    beforeEach(function(done){
      movie = new Movie();

      db_cleaner = new sqlite3.Database('db/test.db');

      db_cleaner.serialize(function(){
        db_cleaner.exec(
          "BEGIN; \
          DELETE FROM movies; \
          INSERT INTO movies(title, overview, release_date, inventory, available) \
          VALUES('Jaws', 'Shark!', 'Yesterday', 10, 10), \
                ('Maws', 'Worm!', 'Yesterday', 11, 11); \
          COMMIT;",
          function(err) {
            db_cleaner.close();
            done();
          }
        );
      })
    })

    it("finds 'Jaws' title in the movies table", function(done) {
      movie.find_by('title', "Jaws", function(err, result){
        assert.equal(result[0].title, 'Jaws');
        done();
      });
    })
  })
});
