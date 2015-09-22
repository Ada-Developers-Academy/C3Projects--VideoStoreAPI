var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    Customer = require('../../customers'),
    customer_keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'],
    rental_keys = ['id', 'check_out', 'check_in', 'due_date', 'overdue', 'movie_title', 'customer_id'];

describe("customers controller", function() {
  var customer, db_cleaner;

  beforeEach(function(done) {
    customer = new Customer();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM rentals; DELETE FROM customers; \
        INSERT INTO rentals(check_out, check_in, due_date, overdue, movie_title, customer_id) \
        VALUES('2015-06-16', '2015-06-17', '2015-06-19', 0, 'Jaws', 1), \
              ('2015-06-16', null, '2015-06-19', 1, 'Alien', 1); \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Harry', 20150616, '1234', 'Seattle', 'WA', '98103', '1234567', 123), \
              ('Hermione', 20150501, '5678', 'London', 'UK', '99999', '1234568', 213); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("GET '/customers'", function() {
    it("knows about the route", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of all the customer objects", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });
  });

  describe("GET '/customers/registered_at_sort/:records_per_page/:offset'", function() {
    it("knows about the route", function(done) {
      agent.get('/customers/registered_at_sort/1/2').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of n customer objects offset by p", function(done) {
      agent.get('/customers/registered_at_sort/1/0').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);

          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });

    it("the returned array is sorted by registered_at field", function(done) {
      agent.get('/customers/registered_at_sort/1/0').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body[0].name, "Hermione");
          done();
        });
    });
  });

  describe("GET /customers/name_sort/:records_per_page/:offset", function() {
    it("knows about the route", function(done) {
      agent.get("/customers/name_sort/1/0").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of n customer objects offset by p", function(done) {
      agent.get('/customers/name_sort/2/0').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });

    it("the returned array is sorted by name field", function(done) {
      agent.get('/customers/name_sort/1/0').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body[0].name, "Harry");
          done();
        });
    });
  });

  describe("GET /customers/postal_code_sort/:records_per_page/:offset", function(done) {
    it("knows about the route", function(done) {
      agent.get("/customers/postal_code_sort/1/0").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of n customer objects offset by p", function(done) {
      agent.get('/customers/postal_code_sort/2/0').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });

    it("the returned array is sorted by postal_code field", function(done) {
      agent.get('/customers/postal_code_sort/1/0').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body[0].name, "Harry");
          done();
        });
    });
  });

  describe("GET /customers/:id/current_rentals", function() {
    it("knows about the route", function(done) {
      agent.get("/customers/2/current_rentals").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("retuns an array of the customer with current rentals", function(done) {
      agent.get("/customers/1/current_rentals").set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(error, result) {
        assert.equal(result.body.length, 1);
        assert.equal(result.body[0].movie_title, "Alien");

        assert.deepEqual(Object.keys(result.body[0]), rental_keys);
        done();
      });
    });
  });
});
