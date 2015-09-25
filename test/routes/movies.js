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
          ('I Want to Believe', 'second xfiles movie', '2008', 4), \
          ('A Movie', 'some plot', '2009', 3); \
        DELETE FROM rentals; \
        INSERT INTO rentals (customer_id, movie_id, checkout_date, due_date, \
          returned_date) \
        VALUES (1, 1, '2012', '2013', '2013'), \
          (1, 2, '2008', '2009', '2009'), \
          (1, 2, '2014', '2015', ''), \
          (2, 1, '2005', '2006', '2006'), \
          (2, 1, '2015', '2016', ''); \
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
        .expect(200, function(error, response) {
          var movies = response.body.movies;

          assert(movies instanceof Array);
          done();
      });
    });

    it("returns as many movies as there are in the table: 3", function(done) {
      agent.get('/movies').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var movies = response.body.movies;

          assert.equal(movies.length, 3);
          done();
      });
    });

    it("the movie objects contain movie data", function(done) {
      agent.get('/movies').set('Accept', 'application/json')
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

  describe("GET /movies/:title/:order", function() {
    it("responds with json", function(done) {
      agent.get('/movies/Fight the Future/id').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an object", function(done) {
      agent.get('/movies/Fight the Future/id').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var movie = response.body;

          assert(movie instanceof Object);
          done();
      });
    });

    it("returns the movie with the title from the url", function(done) {
      agent.get('/movies/Fight the Future/id').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var movieData = response.body.movie_data;

          assert.equal(movieData.title, 'Fight the Future');
          done();
      });
    });

    it("returns a currentRenters object with a list of current renters", function(done) {
      agent.get('/movies/Fight the Future/id').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var currentRenters = response.body.customers.current_renters;

          assert(currentRenters[0].name, 'Fox Mulder');
          done();
      });
    });

    it("returns a pastRenters object with a list of past renters sorted by the order variable", function(done) {
      agent.get('/movies/Fight the Future/id').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var pastRenters = response.body.customers.past_renters;

          assert(pastRenters[0].customer_data.name, 'Alex Krychek');
          done();
      });
    });
  });

describe("GET /movies/:sort_by/:number/:offset", function() {
    it("responds with json", function(done) {
      agent.get('/movies/title/1/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an object", function(done) {
      agent.get('/movies/title/1/1').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var movies = response.body;
          assert(movies instanceof Object);
          done();
      });
    });

    it("returns the number of movies in the number parameter", function(done) {
      agent.get('/movies/title/2/0').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var movies = response.body.movies;

          assert.equal(movies.length, 2);
          done();
      });
    });

    it("returns movies ordered alphabetically", function(done) {
      agent.get('/movies/title/1/0').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var movies = response.body.movies;

          // this is the third movie by id, but the first alphabetically
          assert(movies[0].title, "A Movie");
          done();
      });
    });

    it("returns movies starting from the id listed in the offset", function(done) {
      agent.get('/movies/title/1/1').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var movies = response.body.movies;

           // this is the second movie alphabetically
          assert(movies[0].title, "Fight the Future");
          done();
      });
    });
  });
});
