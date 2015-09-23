var assert = require('assert'),
    Movie  = require('../../models/movie'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose();

describe("Movie", function() {
  var movie, db_cleaner;

  beforeEach(function(done) {
    movie = new Movie();

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
        VALUES('2015-09-23', '2015-09-30', 1, 1, 'true'), \
              ('2015-09-16', '2015-09-23', 2, 2, 'false'); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  });

  describe.only("instance methods", function() {
    context("GET #find_all", function() {
      it("retrieves all movie records", function(done) {
        movie.find_all(function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          assert.equal(res.length, 5);
          assert.equal(res[0].title, 'Jaws');
          assert.equal(res[1].title, 'Maws');
          done();
        });
      });
    });

    context("GET #by_column", function() {
      it("successfully retrieves an array object", function(done) {
        movie.by_column("title", 1, 0, function(err, res) {
          assert.equal(err, undefined);
          assert(res instanceof Array);
          done();
        });
      });
    });

      it("retrieves records sorted by title column", function(done) {
        movie.by_column("title", 2, 0, function(err, res) {
          assert.equal(res.length, 2);
          assert.equal(res[0].title, 'Claws');
          assert.equal(res[1].title, 'Gauze');
          done();
        });
    });

      it("retrieves records sorted by release date", function(done) {
        movie.by_column("release_date", 2, 0, function(err, res) {
          assert.equal(res.length, 2);
          assert.equal(res[0].title, 'Jaws');
          assert.equal(res[1].title, 'Maws');
          done();
        });
      });

      it("retrieves records offset by correct number of records", function(done) {
        movie.by_column("title", 2, 1, function(err, res) {
          assert.equal(res.length, 2);
          assert.equal(res[0].title, 'Gauze');
          done();
        });
      });

      context("GET #customers_by_movie_current", function() {
        it("gets customers that have currently checked out a copy of the film", function(done) {
          movie.customers_by_movie_current("Jaws", function(err, res) {
            assert.equal(err, undefined);
            assert(res instanceof Array);
            assert.equal(res.length, 1);
            assert.equal(res[0].name, 'BeetleJaws');
            done();
          });
        });
      });

      context("GET customers_by_movie_history", function() {
        it("gets customers that have checked out a copy of the film in the past", function(done) {
          movie.customers_by_movie_history("Maws", function(err, res) {
            assert.equal(err, undefined);
            assert(res instanceof Array);
            assert.equal(res.length, 1);
            assert.equal(res[0].name, 'JuiceMaws');
            done();
          });
        });
      });

      context("GET customers_by_movie_history_sorted", function() {
        it("gets customers that have checked out a copy of the film in the past", function(done) {
          movie.customers_by_movie_history("Maws", function(err, res) {
            assert.equal(err, undefined);
            assert(res instanceof Array);
            assert.equal(res.length, 1);
            assert.equal(res[0].name, 'JuiceMaws');
            done();
          });
        });
      });


      // it("can save changes to a movie", function(done) {
      //   movie.find_by("title", "Jaws", function(err, res) {
      //     var original_title = res[0].title;
      //     var id = res[0].id;
      //     movie.save({title: "Jaws 2: Jawsier", id: id}, function(err, res) {
      //       assert.equal(err, undefined);
      //       assert.equal(res.inserted_id, 0); //it didn't insert any records
      //       assert.equal(res.changed, 1); //it updated one record
      //       done();
      //     });
      //   });
      // });
    //
    // context("POST", function() {
    //   it ("can make a post", function(done) {
    //     agent.post('/movies').set('Accept', 'application/json')
    //     .field('title', 'RoboJaws')
    //     .field('release_date', 'Tomorrow')
    //     .expect();
    //     done();
    //   });
    // });

//     it("can save a new movie to the database", function(done) {
//       var data = {
//         title: "RoboJaws",
//         overview: "Jaws is hunted by RoboJaws",
//         release_date: "Tomorrow",
//         inventory: 10
//       }
// // insert into mocha tests
//       movie.create(data, function(err, res) {
//         assert.equal(res.inserted_id, 6); //it inserted a new record
//         assert.equal(res.changed, 1); //one record was changed
//
//         movie.find_by("title", "RoboJaws", function(err, res) {
//           assert.equal(res.length, 1);
//           assert.equal(res[0].title, 'RoboJaws'); //we found our new movie
//           done();
//         });
//       });
//     });
  });
});
