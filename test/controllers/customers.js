var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose()
    request = require('supertest'),
    app = require('../../app'),
    agent = request.agent(app);

describe("/customers", function() {
  var test_db;

  beforeEach(function(done) {

    test_db = new sqlite3.Database('db/test.db');
    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM customers; \
        DELETE FROM rentals; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Jim', 'Wed, 29 Apr 2015 07:54:14 -0700', '1800 Some Place', 'whooville', 'TX', '90211', '555-5555', 17.38), \
              ('Jack', 'Tue, 4 Apr 2015 07:54:14 -0700', '555 Some Where', 'anthill', 'CA', '90210', '123-4444', 19.84); \
        INSERT INTO rentals(checkout_date, due_date, return_date, overdue, movie_title, customer_id) \
        VALUES('2015-09-10', '2015-09-13', '2015-09-12', 0, 'Jaws', 1), \
              ('2015-09-17', '2015-09-21', null, 0, 'Jawsier', 1); \
        COMMIT;"

        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  describe("GET '/'", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent.get('/customers').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array of customer objects", function(done) {
      customer_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 2);

        var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
        assert.deepEqual(Object.keys(res.body[0]), keys);
        done();
      })
    })
  })

  describe("GET '/name/:records/:offset'", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent.get('/customers/name/2/0').set('Accept', 'application/json');
      done();
    })

    it("returns an array of 2 customers sorted by name", function(done) {
      customer_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 2);
        assert.equal(res.body[0].name, "Jack");
        assert.equal(res.body[1].name, "Jim");
        done();
      })
    })
  })

  describe("GET '/registered/:records/:offset'", function() {
    it("returns an array of 2 customers sorted by date of registration in ascending order", function(done) {
      customer_request = agent.get('/customers/registered/2/0').set('Accept', 'application/json');
      customer_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 2);
        assert.equal(res.body[0].id, 2);
        assert.equal(res.body[1].id, 1);
        done();
      })
    })
  })

  describe("GET '/postal/:records/:offset'", function() {
    it("returns an array of 2 customers sorted by postal code in ascending order", function(done) {
      customer_request = agent.get('/customers/postal/2/0').set('Accept', 'application/json');
      customer_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 2);
        assert.equal(res.body[0].id, 2);
        assert.equal(res.body[1].id, 1);
        done();
      })
    })
  })

  describe("GET '/current/:id'", function() {
    it("returns an array of movies rented by customer with id 1", function(done) {
      customer_request = agent.get('/customers/current/1').set('Accept', 'application/json');
      customer_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 1);
        assert.equal(res.body[0].return_date, null);
        assert.equal(res.body[0].customer_id, 1);
        done();
      })
    })
  })

  describe("GET '/history/:id'", function() {
    it("returns an array of all rentals by customer with id 1", function(done) {
      customer_request = agent.get('/customers/history/1').set('Accept', 'application/json');
      customer_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 1);
        console.log(res.body);
        assert.notEqual(res.body[0].return_date, null);
        done();
      })
    })
  })
})
