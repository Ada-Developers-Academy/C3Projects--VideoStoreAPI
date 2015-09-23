var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose(),
    request = require('supertest'),
    app     = require('../../app'),
    customers_controller  = require('../../controllers/customers'),
    agent   = request.agent(app);
    KEYS    = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];

describe.only("Endpoints under /customers", function() {
  var db_cleaner;

  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Beetle Juice', '2015-01-01', '123 street', 'Burlington', 'WA', '98101', '3604216650', 5.25), \
              ('Juicy Beetle', '2014-01-01', '123 street', 'Burlington', 'WA', '98211', '3604216650', 5.55), \
              ('Aaron Aaronson', '2015-02-01', '123 street', 'Burlington', 'WA', '98195', '3604216650', 5.55); \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10), \
              ('Maws', 'Worm!', 'Yesterday', 11); \
        DELETE FROM rentals; \
        INSERT INTO rentals(checkout_date, return_date, movie_id, customer_id, checked_out) \
        VALUES('2015-02-14', '2015-02-21', '1', '1', 'false'), \
              ('2015-09-22', '2015-09-29', '1', '2', 'true'), \
              ('2015-09-22', '2015-09-29', '2', '2', 'true'), \
              ('2015-07-22', '2015-09-01', '2', '1', 'true'); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("customer instance methods", function() {
    context("GET /customers", function() {
      var customer_request;

      beforeEach(function(done) {
        customer_request = agent.get('/customers').set('Accept', 'application/json');
        done();
      });

      it("responds with json", function(done) {
        customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });

      it('knows about the route', function(done) {
        customer_request
        .expect(200, function(err,res) {
          assert.equal(err, undefined);
          done();
          });
      });

      it("returns an array of customer objects", function(done) {
        customer_request
        .expect(200, function(error, result) {
          assert(result.body instanceof Array);
          assert.equal(result.body.length, 3);
          assert.equal(result.body[0].name, 'Beetle Juice');
          assert.equal(result.body[1].name, 'Juicy Beetle');
          assert.deepEqual(Object.keys(result.body[0]), KEYS);
          done();
        });
      });
    });

    context("GET /customers/:column/:n/:p", function() {
      var customer_request;

      beforeEach(function(done) {
        customer_request = agent.get('/customers/name/2/1').set('Accept', 'application/json');
        done();
      });

      it("responds with json", function(done) {
        customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });

      it('knows about the route', function(done) {
        customer_request
        .expect(200, function(err,res) {
          assert.equal(err, undefined);
          done();
          });
      });

      it("returns an array of customer objects", function(done) {
        customer_request
        .expect(200, function(error, result) {
          assert(result.body instanceof Array);
          assert.equal(result.body[0].name, 'Beetle Juice');
          assert.equal(result.body[1].name, 'Juicy Beetle');
          assert.deepEqual(Object.keys(result.body[0]), KEYS);
          done();
        });
      });

      it("returns specified number of customers", function(done) {
        customer_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);
          done();
        });
      });

      it("returns customers with specified offset", function(done) {
        customer_request
        .expect(200, function(error, result) {
          assert.notEqual(result.body[0].name, "Aaron Aaronson");
          done();
        });
      });
    });

    context("GET /customers/:customer_id/movies", function() {
      var customer_request;
      var movie_keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'num_available'];

      beforeEach(function(done) {
        customer_request = agent.get('/customers/2/movies').set('Accept', 'application/json');
        done();
      });

      it("responds with json", function(done) {
        customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
      });

      it('knows about the route', function(done) {
        customer_request
        .expect(200, function(err,res) {
          assert.equal(err, undefined);
          done();
          });
      });

      it('returns an array of movie objects', function(done) {
        customer_request
        .expect(200, function(error, result) {
          assert(result.body instanceof Array);
          assert.equal(result.body.length, 2);
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
      });

      it('contains movies the customer currently has checked out', function(done) {
        customer_request
        .expect(200, function(error, result) {
          assert.equal(result.body[0].title, 'Jaws');
          assert.equal(result.body[1].title, 'Maws');
          done();
        });
      });

    });

  });
});
