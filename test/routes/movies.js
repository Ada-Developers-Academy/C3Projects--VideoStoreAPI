var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("movies routes", function() {
  var db_cleaner;

  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');

    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers (name, registered_at, address, city, state, \
          postal_code, phone, account_credit) \
        VALUES ('Alex Krychek', 'Wed, 16 Apr 2014 21:40:20 -0700', \
          'P.O. Box 887, 4257 Lorem Rd.', 'Columbus', 'Ohio', '43201', \
          '(371) 627-1105', 1234), \
        ('Fox Mulder', 'Fri, 10 Jul 2015 15:23:06 -0700', '152-525 Odio St.', \
          'Seattle', 'Washington', '98109', '(206) 329-4928', 293); \
        DELETE FROM movies; \
        INSERT INTO movies (title, overview, release_date, inventory) \
        VALUES ('Fight the Future', 'first xfiles movie', '1998', 2), \
          ('I Want to Believe', 'second xfiles movie', '2008', 4); \
        DELETE FROM rentals; \
        INSERT INTO rentals (customer_id, movie_id, checkout_date, due_date, \
          returned_date) \
        VALUES (1, 1, '2012', '2013', '2013'), \
          (1, 2, '2008', '2009', '2009'), \
          (1, 2, '2014', '2015', ''); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("GET /movies", function() {

    it("responds with json", function(done) {
      agent.get('/movies').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of objects", function(done) {
      agent.get('/movies').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var movies = response.body.movies;

          assert(movies instanceof Array);
          done();
      });
    });

    it("returns as many movies as there are in the table: 2", function(done) {
      agent.get('/movies').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var movies = response.body.movies;

          assert.equal(movies.length, 2);
          done();
      });
    });

    it("the movie objects contain movie data", function(done) {
      agent.get('/movies').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var movie = response.body.movies[0];

          // 'Fight the Future', 'first xfiles movie', '1998', 2
          assert.equal(movie.title, "Fight the Future");
          assert.equal(movie.overview, 'first xfiles movie');
          assert.equal(movie.release_date, '1998');
          assert.equal(movie.inventory, 2);
          done();
      });
    });
  });

  // describe("GET /customers/:id", function() {
  //   it("responds with json", function(done) {
  //     agent.get('/customers/1').set('Accept', 'application/json')
  //       .expect('Content-Type', /application\/json/)
  //       .expect(200, function(error, response) {
  //         assert.equal(error, undefined);
  //         done();
  //       });
  //   });
  // });
});
