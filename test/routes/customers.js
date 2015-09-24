var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("customers routes", function() {
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

  describe("GET /customers", function() {

    it("responds with json", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of objects", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var customers = response.body.customers;

          assert(customers instanceof Array);
          done();
      });
    });

    it("returns as many customers as there are in the table: 2", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var customers = response.body.customers;

          assert.equal(customers.length, 2);
          done();
      });
    });

    it("the customer objects contain customer data", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var customer = response.body.customers[0];

          assert.equal(customer.name, "Alex Krychek");
          assert.equal(customer.registered_at, 'Wed, 16 Apr 2014 21:40:20 -0700');
          assert.equal(customer.address, 'P.O. Box 887, 4257 Lorem Rd.');
          assert.equal(customer.city, "Columbus");
          assert.equal(customer.state, "Ohio");
          assert.equal(customer.postal_code, "43201");
          assert.equal(customer.phone, "(371) 627-1105");
          assert.equal(customer.account_credit, 1234);
          done();
      });
    });
  });

  describe("GET /customers/:id", function() {
    it("responds with json", function(done) {
      agent.get('/customers/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an object", function(done) {
      agent.get('/customers/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var result = response.body;

          assert(result instanceof Object);
          done();
        });
    });

    it("returns an object that has customer_data and movies", function(done) {
      agent.get('/customers/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var result = response.body;
          var keys = Object.keys(result);

          assert.equal(keys.length, 2);
          assert.equal(keys[0], "customer_data");
          assert.equal(keys[1], "movies")
          done();
        });
    });

    it("returns a list of movies currently checked out", function(done) {
      agent.get('/customers/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var currentRentals = response.body.movies.currentRentals;
          var movie = currentRentals[0];

          assert.equal(currentRentals.length, 1);
          assert.equal(movie.title, "I Want to Believe"); 
          assert.equal(movie.overview, "second xfiles movie"); 
          assert.equal(movie.release_date, "2008");
          assert.equal(movie.inventory, 4);
          done();
        });
    });

    it("returns a list of past rentals", function(done) {
      agent.get('/customers/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var pastRentals = response.body.movies.pastRentals;
          var movie = pastRentals[0].movie_data;

          assert.equal(pastRentals.length, 2);
          assert.equal(movie.title, "I Want to Believe"); 
          assert.equal(movie.overview, "second xfiles movie"); 
          assert.equal(movie.release_date, "2008");
          assert.equal(movie.inventory, 4);
          done();
        });
    });

    it("sorts past rentals by checkout date", function(done) {
      agent.get('/customers/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var pastRental1 = response.body.movies.pastRentals[0].movie_data;
          var pastRental2 =  response.body.movies.pastRentals[1].movie_data;

          assert.equal(pastRental1.title, "Fight the Future");
          assert.equal(pastRental2.title, "I Want to Believe");
          done();
        });
    });

    it("includes return date for past rentals", function(done) {
      agent.get('/customers/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var pastRentals = response.body.movies.pastRentals;
          var movie1ReturnDate = pastRentals[0].returnedDate;
          var movie2ReturnDate = pastRentals[1].returnedDate;

          assert.equal(movie1ReturnDate, 2013);
          assert.equal(movie2ReturnDate, 2009);
          done();
        });
    });
  });
});
