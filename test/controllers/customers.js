var request = require('supertest');
var assert  = require('assert');
var app     = require('../../app');
var sqlite3 = require('sqlite3').verbose();
var agent   = request.agent(app);

describe("Customers Controller", function() {
  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.parallelize(function() {
        db_cleaner.exec(
          "BEGIN TRANSACTION; \
          DELETE FROM rentals; \
          INSERT INTO rentals(check_out_date, check_in_date, expected_return_date, customer_id, movie_id) \
          VALUES('2015-01-01', '2015-01-10', '2015-02-01', 1, 1), \
                ('2015-01-01', null, '2015-02-01', 1, 2); \
          COMMIT TRANSACTION;"
        ); // rentals

        db_cleaner.exec(
          "BEGIN TRANSACTION; \
          DELETE FROM movies; \
          INSERT INTO movies(title, overview, release_date, inventory) \
          VALUES('The Movie', 'See title.', '2000-01-01', 10), \
                ('The Movie: Sequal', 'So amazing.', '2001-01-01', 5); \
          COMMIT TRANSACTION;"
        ); // movies

        db_cleaner.exec(
          "BEGIN TRANSACTION; \
          DELETE FROM customers; \
          INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
          VALUES('B', '2015-01-01', '111 St', 'Seattle', 'WA', '55555', '555-5555', 19.50), \
                ('A', '2015-01-02', '222 St', 'Seattle', 'WA', '11111', '666-6666', 18.50), \
                ('C', '2014-01-01', '333 St', 'Seattle', 'WA', '99999', '444-4444', 21.00); \
          COMMIT TRANSACTION;"
        ); // customers
      })

      db_cleaner.close(function() {
        done();
      });
    });
  })

  describe("GET /customers", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });

    it("returns an array of all customer objects", function(done) {
      customer_request
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);

          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(result.body[0]), keys);
          done();
        })
    });
  });

  describe("GET /customers/:id/current", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/1/current')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("can find customer with id 1", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          var keys = ['movie_id', 'title', "check_out_date", "expected_return_date"];
          assert.deepEqual(Object.keys(res.body), keys);

          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].movie_id, 2);

          done();
        })
    });
  });

  describe("GET /customers/:id/history", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/1/history')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("can find customer with id 1", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          var keys = ['movie_id', 'title', "check_out_date", "check_in_date", "expected_return_date"];
          assert.deepEqual(Object.keys(res.body), keys);

          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].movie_id, 1);

          done();
        })
    });
  });

  describe("GET /customers/by_name", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/by_name')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("returns all customers sorted by name", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 3);

          assert.equal(res.body[0].name, 'A');
          assert.equal(res.body[1].name, 'B');
          assert.equal(res.body[2].name, 'C');

          done();
        })
    });

    it("returns a customer with the correct keys", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          done();
        })
    });
  });

  describe("GET /customers/by_name?n=1&p=2", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/by_name?n=1&p=2')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("returns a customer sorted by name", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].name, 'B');

          done();
        })
    });
  });

  describe("GET /customers/by_registered_at", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/by_registered_at')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("returns all customers sorted by registered at", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 3);

          assert.equal(res.body[0].name, 'C');
          assert.equal(res.body[1].name, 'B');
          assert.equal(res.body[2].name, 'A');

          done();
        })
    });

    it("returns a customer with the correct keys", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          done();
        })
    });
  });

  describe("GET /customers/by_registered_at?n=1&p=3", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/by_registered_at?n=1&p=3')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("returns a customer sorted by registered_at", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].name, 'A');

          done();
        })
    });
  });

  describe("GET /customers/by_postal_code", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/by_postal_code')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("returns all customers sorted by postal code", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 3);

          assert.equal(res.body[0].name, 'A');
          assert.equal(res.body[1].name, 'B');
          assert.equal(res.body[2].name, 'C');

          done();
        })
    });

    it("returns a customer with the correct keys", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          done();
        })
    });
  });

  describe("GET /customers/by_postal_code?n=1&p=3", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent
                         .get('/customers/by_postal_code?n=1&p=3')
                         .set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it("returns a customer sorted by postal code", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].name, 'C');

          done();
        })
    });
  });
});
