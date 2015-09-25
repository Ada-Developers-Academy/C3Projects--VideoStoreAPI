var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("/rentals endpoints", function() {
  var test_db;

  beforeEach(function(done) {
    test_db = new sqlite3.Database('db/test.db');

    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM movies; \
        DELETE FROM rentals; \
        INSERT INTO movies(title, overview, release_date, inventory_total, inventory_avail) \
        VALUES('Bring It On', 'Cheerleaders duel it out.', '2000-08-22', 10, 10), \
              ('Maws', 'Worm!', '1998-02-11', 11, 11), \
              ('Bring It On 2', 'Moar cheerleaders', '1990-04-12', 12, 12); \
        INSERT INTO rentals(customer_id, name, movie_id, title, checkout_date, due_date, return_date) \
        VALUES(1, 'Sarah', 1, 'Bring It On', '2015-07-14', '2015-07-21', '2015-07-21'), \
              (1, 'Sarah', 2, 'Maws', '2015-07-16', '2015-07-23', '2015-07-19'), \
              (1, 'Sarah', 3, 'Bring It On 2', '2015-07-01', '2015-07-08', '2015-07-09'), \
              (2, 'Jane', 1, 'Bring It On', '2015-07-14', '2015-07-21', '2015-07-15'), \
              (2, 'Jane', 2, 'Maws', '2015-07-16', '2015-07-23', '2015-07-17'), \
              (2, 'Jane', 3, 'Bring It On 2', '2015-07-01', '2015-07-08', NULL), \
              (2, 'Jane', 2, 'Maws', '2015-07-01', '2015-10-08', NULL), \
              (1, 'Sarah', 2, 'Maws', '2015-07-01', '2015-07-08', '2015-07-10'); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  describe("GET /rentals/title/{:title}", function() {
    var rental_request;

    it("responds with json", function(done) {
      rental_request = agent.get('/rentals/title/maws').set('Accept', 'application/json');

      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array of rental objects", function(done) {
      rental_request = agent.get('/rentals/title/bring').set('Accept', 'application/json');

      rental_request.expect(200, function(error, result) {

        var keys = ['rental_id', 'movie_id', 'movie_title', 'customer_id', 'customer_name', 'checkout_date', 'due_date', 'return_date'];
        assert.deepEqual(Object.keys(result.body.current_rentals[0]), keys);
        done();
      })
    })

    it('separates rental history into current and previous rentals', function(done) {
      rental_request = agent.get('/rentals/title/bring').set('Accept', 'application/json');

      rental_request.expect(200, function(error, result) {
        assert.equal(result.body.current_rentals.length, 1);
        assert.equal(result.body.previous_rentals.length, 3);
        done();
      }) 
    })

    it("can be ordered by name (customer's name)", function(done) {
      rental_request = agent.get('/rentals/title/bring?order_by=name').set('Accept', 'application/json');
      
      rental_request.expect(200, function(error, result) {
        assert.equal(result.body.previous_rentals[0].customer_name, "Jane");
        assert.equal(result.body.previous_rentals[1].customer_name, "Sarah");
        assert.equal(result.body.previous_rentals[2].customer_name, "Sarah");
        done();
      })
    })

    it("can be ordered by return_date", function(done) {
      rental_request = agent.get('/rentals/title/bring?order_by=return_date').set('Accept', 'application/json');
      
      rental_request.expect(200, function(error, result) {
        assert.equal(result.body.previous_rentals[0].return_date, "2015-07-09");
        assert.equal(result.body.previous_rentals[1].return_date, "2015-07-15");
        assert.equal(result.body.previous_rentals[2].return_date, "2015-07-21");
        done();
      })
    })
  })

  describe('GET /rentals/overdue', function() {
    var rental_request;

    it("responds with json", function(done) {
      rental_request = agent.get('/rentals/overdue').set('Accept', 'application/json');

      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it('returns an array of overdue rental records', function(done) {
      rental_request = agent.get('/rentals/overdue').set('Accept', 'application/json');

      rental_request.expect(200, function(error, result) {
        assert.equal(result.body.overdue_movies.length, 1); // only 1 seed record has no return_date and has a past due_date
        assert.equal(result.body.overdue_movies[0].title, "Bring It On 2");
        done();
      })
    })

    it('does not consider movies that have been returned late as still overdue', function(done) {
      rental_request = agent.get('/rentals/overdue').set('Accept', 'application/json');

      rental_request.expect(200, function(error, result) {
        assert.notEqual(result.body.overdue_movies[0].name, "Sarah"); // Sarah returned a movie late
        done();
      })
    })  
  })

  describe('POST ./rentals/{:customer_id}/checkout/{:movie_id}', function() {

    it("responds with json", function(done) {
      rental_request = agent.post('/rentals/2/checkout/1').set('Accept', 'application/json');

      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it('creates a new rental record and returns that rental record', function(done) {
      rental_request = agent.post('/rentals/2/checkout/1').set('Accept', 'application/json');

      rental_request.expect(200, function(error, result) {

        assert.equal(result.body.rental.length, 1);
        assert.equal(result.body.rental[0].customer_id, 2);
        done();
      })
    })

    it("sets the checkout_date to be day('now')", function(done) {
      rental_request = agent.post('/rentals/2/checkout/1').set('Accept', 'application/json');
      
      rental_request.expect(200, function(error, result) {
        var today = new Date;
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();

        if(day < 10) { day = '0' + day } 
        if(month < 10) { month = '0' + month }

        var now = year + "-" + month + "-" + day;

        assert.equal(result.body.rental[0].checkout_date, now);
        done();
      })
    })

    it("sets a due_date greater than today", function(done) {
      rental_request = agent.post('/rentals/2/checkout/1').set('Accept', 'application/json');

      rental_request.expect(200, function(error, result) {
        var today = new Date;
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();

        if(day < 10) { day = '0' + day } 
        if(month < 10) { month = '0' + month }

        var now = year + "-" + month + "-" + day;

        assert(result.body.rental[0].due_date > now);
        done();
      })
    })
  });

  describe('PUT ./rentals/{:customer_id}/return/{:movie_id}', function() {

    it("responds with json", function(done) {
      rental_request = agent.put('/rentals/2/return/2').set('Accept', 'application/json');

      rental_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("updates return_date to date('now') and returns the customer's rental history for that movie", function(done) {
      rental_request = agent.put('/rentals/2/return/2').set('Accept', 'application/json');

      rental_request.expect(200, function(error, result) {
        var today = new Date;
        var day = today.getDate();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();

        if(day < 10) { day = '0' + day } 
        if(month < 10) { month = '0' + month }

        var now = year + "-" + month + "-" + day;

        assert.equal(result.body.rental_history.length, 2);
        assert.equal(result.body.rental_history[0].customer_id, 2);
        assert.equal(result.body.rental_history[0].return_date, now);
        done();
      })
    })
  })

})
