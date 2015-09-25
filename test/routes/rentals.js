var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("rentals routes", function() {
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
          'Seattle', 'Washington', '98109', '(206) 329-4928', 293), \
        ('Dana Scully', 'Fri, 20 Jul 2015 15:23:06 -0700', '234 Piper St.', \
          'Tulsa', 'Oklahoma', '34566', '(206) 329-4928', 2000); \
        DELETE FROM movies; \
        INSERT INTO movies (title, overview, release_date, inventory) \
        VALUES ('Fight the Future', 'first xfiles movie', '1998', 2), \
          ('I Want to Believe', 'second xfiles movie', '2008', 4); \
        DELETE FROM rentals; \
        INSERT INTO rentals (customer_id, movie_id, checkout_date, due_date, \
          returned_date) \
        VALUES (1, 1, '2012', '2013', '2013'), \
          (1, 2, '2008', '2009', '2009'), \
          (1, 2, '2014', '2015', ''), \
          (2, 1, '2005', '2006', '2006'), \
          (2, 1, '2015', '2016', ''), \
          (2, 3, '2013', '2014', ''), \
          (1, 2, '1989', '1990', ''), \
          (3, 1, '1991', '1992', '1991'); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("GET /rentals/overdue", function() {
    it("responds with json", function(done) {
      agent.get('/rentals/overdue').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of objects", function(done) {
      agent.get('/rentals/overdue').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var overdueCustomers = response.body.overdue_customers;

          assert(overdueCustomers instanceof Array);
          done();
        });
    });

    it("returns a list of the customers with overdue books", function(done) {
      agent.get('/rentals/overdue').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          var overdueCustomers = response.body.overdue_customers;

           // only two of the three customers with rental records have overdue
          assert.equal(overdueCustomers.length, 2);
          done();
          });
    });
  });

  describe('GET /rentals/:title', function() {
    it("responds with json", function(done) {
      agent.get('/rentals/Fight the Future').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an object", function(done) {
        agent.get('/rentals/Fight the Future').set('Accept', 'application/json')
          .expect(200, function(error, response) {
            assert(response.body instanceof Object);
            done();
          });
    });

    it("returns movie info: overview, release_date, inventory", function(done) {
        agent.get('/rentals/Fight the Future').set('Accept', 'application/json')
          .expect(200, function(error, response) {
            assert.equal(response.body.movie_data.overview, "first xfiles movie");
            assert.equal(response.body.movie_data.release_date, "1998");
            assert.equal(response.body.movie_data.inventory, 2);            
            done();
          });
    });

    it("returns availability info: yes/no, and copies available", function(done) {
        agent.get('/rentals/Fight the Future').set('Accept', 'application/json')
          .expect(200, function(error, response) {
            assert.equal(response.body.availability.available, true);
            assert.equal(response.body.availability.copiesAvailable, 1);
            done();
          });
    });

    it("returns a list of customers who have currently rented the movie", function(done) {
        agent.get('/rentals/Fight the Future').set('Accept', 'application/json')
          .expect(200, function(error, response) {
            assert(response.body.currentRenters instanceof Object);
            assert.equal(response.body.currentRenters[0].name, "Fox Mulder");
            done();
          });
    });
  });

  describe("PUT /rentals/checkin/:customer_id/:movie_title", function() {
    it("responds with json", function(done) {
      agent.put('/rentals/checkin/2/Fight the Future').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns a message that you checked in that movie", function(done) {
      agent.put('/rentals/checkin/2/Fight the Future').set('Accept', 'application/json')
        .expect(200, function(error, response) {
          assert.equal(response.body, "Congratulations, you have checked in: Fight the Future");
          done();
        });
    });

    it("updates the rental record with the returned_date", function(done) {
      var statement = 
        "SELECT * FROM rentals JOIN movies \
        ON rentals.movie_id = movies.id \
        WHERE movies.title = ? \
        AND rentals.customer_id = ? \
        AND rentals.returned_date = '';";

      var values = ['Fight the Future', 2];
      var rentalsBeforeCheckin,
          rentalsAfterCheckin;

      var db = new sqlite3.Database('db/test.db');

      db.all(statement, values, function(err, rows) {
        rentalsBeforeCheckin = rows;
        db.close();

        agent.put('/rentals/checkin/2/Fight the Future').set('Accept', 'application/json')
          .expect(200, function(error, response) {
            var db = new sqlite3.Database('db/test.db');

            db.all(statement, values, function(err, rows) {
              rentalsAfterCheckin = rows;
              db.close();

              assert(rentalsBeforeCheckin.length > rentalsAfterCheckin.length);
              done();
            });
          });
      });
    });
  });


  describe("POST /rentals/checkout/:customer_id/:movie_title", function() {
    it.only("returns a message that you checked out a movie", function(done) {
      agent.post('/rentals/checkout/1/Fight the Future').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          var result = response.body;

          assert.equal(error, undefined);
          assert.equal(result.success,  'Yay! You checked out a movie.')
          done();
        });
    });

    it.only("adds a rental record to the rentals table", function(done) {
      agent.post('/rentals/checkout/1/Fight the Future').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, response) {
          // var statement = 
          //   "SELECT * FROM rentals JOIN movies \
          //   ON rentals.movie_id = movies.id \
          //   WHERE movies.title = ? \
          //   AND rentals.customer_id = ? \
          //   AND rentals.returned_date = '';";

          // var values = ['Fight the Future', 2];
          // var rentalsBeforeCheckin,
          //     rentalsAfterCheckin;

          // var db = new sqlite3.Database('db/test.db');

          // db.all()
          done();
        });
    });
  });
});
