var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose()
    request = require('supertest'),
    app = require('../../app'),
    agent = request.agent(app);

describe("/rentals", function() {
  var test_db;

  beforeEach(function(done) {

    test_db = new sqlite3.Database('db/test.db');
    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM rentals; \
        INSERT INTO rentals(checkout_date, due_date, return_date, overdue, movie_title, customer_id) \
        VALUES('2015-09-14', '2015-09-30', null, 0, 'Amelie', 1), \
              ('2015-09-11', '2015-09-14', null, 0, 'Amelie', 2), \
              ('2015-09-09', '2015-09-12', '2015-09-14', 1, 'Jaws', 1), \
              ('2014-09-09', '2014-09-12', '2014-09-11', 0, 'Jaws', 2), \
              ('2015-09-11', '2015-09-14', '2015-09-13', 0, 'Alien', 1), \
              ('2015-09-20', '2015-09-30', null, 0, 'Jaws', 2); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  describe("GET /customers/current", function() {
    var rental_request;

    it("returns distinct customer id and name for all currently checked out movies", function(done) {
      rental_request = agent.get('/rentals/customers/current').set('Accept', 'application/json');
      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['id', 'name'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].id, 1);
          done();
        });
    })
  })

  describe("GET /checkedout/:title", function() {
    var rental_request;

    it("for specific checked out movie, show customer id, name and checkout date", function(done) {
      rental_request = agent.get('/rentals/checkedout/amelie').set('Accept', 'application/json');
      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['id', 'name', 'checkout_date'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].id, 1);
          done();
        });
    })
  })

  describe("GET /history/:title", function() {
    var rental_request;

    it("for past movie checkouts, show customer id, name and checkout date sorted by checkout date", function(done) {
      rental_request = agent.get('/rentals/history/jaws').set('Accept', 'application/json');
      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['id', 'name', 'checkout_date'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].checkout_date, '2015-09-09');
          done();
        });
    })
  })

  describe("GET /history/id/:title", function() {
    var rental_request;

    it("for past movie checkouts, show customer id, name and checkout date sorted by id", function(done) {
      rental_request = agent.get('/rentals/history/id/jaws').set('Accept', 'application/json');
      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['id', 'name', 'checkout_date'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].id, 1);
          done();
        });
    })
  })

  describe("GET /history/name/:title", function() {
    var rental_request;

    it("for past movie checkouts, show customer id, name and checkout date sorted by name", function(done) {
      rental_request = agent.get('/rentals/history/name/jaws').set('Accept', 'application/json');
      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['id', 'name', 'checkout_date'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].name, 'Jack');
          done();
        });
    })
  })

  describe("GET /customers/overdue", function() {
    var rental_request;

    it("return customer id, name and movie title for all overdue movies", function(done) {
      rental_request = agent.get('/rentals/customers/overdue').set('Accept', 'application/json');
      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(err, res) {
          assert.equal(res.body.length, 2);

          var keys = ['id', 'name', 'movie_title'];
          assert.deepEqual(Object.keys(res.body[0]), keys);

          assert.equal(res.body[0].movie_title, 'Amelie');
          done();
        });
    })
  })

  describe("POST /checkout/:title/:customer_id", function() {
    var rental_request;

    it.only("checks out a movie to a given customer", function(done) {
      rental_request = agent.post('/rentals/checkout/alien/1').set('Accept', 'application/json');
      rental_request
      .expect(200, function(err, res) {
        assert.equal(res.body.length, 1);
        console.log(res);

        var keys = ['message', 'movie_title', 'customer_id'];
        assert.deepEqual(Object.keys(res.body[0]), keys);

        assert.equal(res.body[0].movie_title, 'alien');
        done();
      });
    })
  })

  describe("PUT /checkin/:title/:customer_id", function() {
    var rental_request;

    it("checks in a movie for a given customer", function(done) {
      rental_request = agent.put('/rentals/checkin/amelie/1').set('Accept', 'application/json');
      rental_request
      .expect(200, function(err, res) {
        assert.equal(res.body.length, 1);

        var keys = ['message', 'movie_title', 'customer_id'];
        assert.deepEqual(Object.keys(res.body[0]), keys);

        assert.equal(res.body[0].movie_title, 'amelie');
        done();
      });
    })
  })


})
