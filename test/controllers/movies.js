var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    Movie = require('../../movies');

describe.only("movies controller", function() {
  var movie, db_cleaner;
  var movie_keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'inventory_available'];
  var customer_keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
  beforeEach(function(done) {
    movie = new Movie();

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; DELETE FROM customers; DELETE FROM rentals; \
        INSERT INTO rentals(check_out, check_in, due_date, overdue, movie_title, customer_id) \
        VALUES('2015-06-16', '2015-06-17', '2015-06-19', 0, 'Jaws', 1), \
        ('2015-06-10', '2015-06-12', '2015-06-13', 0, 'Jaws', 2),\
        ('2015-06-16', null, '2015-06-19', 1, 'Alien', 1); \
        INSERT INTO movies(title, overview, release_date, inventory, inventory_available) \
        VALUES('Jaws', 'omg sharks!',   '1975-06-19', 6, 6), \
              ('Alien', 'omg aliens!', 1979-05-25, 4, 4); \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Harry', '2015-06-16', '1234', 'Seattle', 'WA', '98103', '1234567', 123),\
        ('Hermione', '2015-06-10', '1234', 'Pasadena', 'CA', '97123', '7654321', 231);\
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });
  var movies_path = '/movies';
  describe("GET movies_path", function() {
    it("knows about the route", function(done) {
      agent.get(movies_path).set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of movie objects", function(done) {
      agent.get(movies_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          movie_keys;
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
    });
  });

  var title_sort_path = '/movies/title_sort/1/1';
  describe("GET title_sort_path", function() {
    it("knows about the route", function(done) {
      agent.get('/movies/title_sort/1/1').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of movie objects 1 per page offset by 2", function(done) {
      agent.get(title_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);
          movie_keys;
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
    });

    it("sorts the movies by title", function(done) {
      agent.get(title_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body[0].title, 'Jaws');
          movie_keys;
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
    })
  });

  var release_date_sort_path = '/movies/title_sort/1/1';
  describe("GET release_date_sort_path", function() {
    it("knows about the route", function(done) {
      agent.get(release_date_sort_path).set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of movie objects 1 per page offset by 2", function(done) {
      agent.get(release_date_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);
          movie_keys;
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
    });

    it("sorts the movies by release date", function(done) {
      agent.get(release_date_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body[0].title, 'Jaws');
          movie_keys;
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
    })
  });

  var current_customers_path = '/movies/Alien/current_customers';
  describe("GET current_customers_path", function() {
    it("knows about the route", function(done) {
      agent.get('/movies/Jaws/current_customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of customers who currently have the movie checked out", function(done) {
      agent.get(current_customers_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });
  });

  var past_customers_path = '/movies/Jaws/past_customers'
  describe("GET past_customers_path", function() {
    it("knows about the route", function(done) {
      agent.get(past_customers_path).set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of customers who have checked the movie out in the past", function(done) {
      agent.get('/movies/Jaws/past_customers').set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });
  });

  var past_customers_id_sort_path = '/movies/Jaws/past_customers/customer_id_sort'
  describe("GET past_customers_id_sort_path", function() {
    it("knows about the route", function(done) {
      agent.get(past_customers_id_sort_path).set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of customers who have checked the movie out in the past", function(done) {
      agent.get(past_customers_id_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });

    it("sorts the customers by id", function(done) {
      agent.get(past_customers_id_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body[0].id, 1);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    })
  });

  var past_customer_name_sort_path = '/movies/Jaws/past_customers/customer_name_sort'
  describe("GET past_customer_name_sort_path", function() {
    it("knows about the route", function(done) {
      agent.get(past_customer_name_sort_path).set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of customers who have checked the movie out in the past", function(done) {
      agent.get(past_customer_name_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });

    it("sorts the customers by name", function(done) {
      agent.get(past_customer_name_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body[0].id, 1);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    })
  });

  var past_customers_checkout_sort_path = '/movies/Jaws/past_customers/checkout_date_sort'
  describe("GET past_customers_checkout_sort_path", function() {
    it("knows about the route", function(done) {
      agent.get(past_customers_checkout_sort_path).set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of customers who have checked the movie out in the past", function(done) {
      agent.get(past_customers_checkout_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    });

    it("sorts the customers by name", function(done) {
      agent.get(past_customers_checkout_sort_path).set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body[0].id, 2);
          customer_keys;
          assert.deepEqual(Object.keys(result.body[0]), customer_keys);
          done();
        });
    })
  });

  //:title
  describe("GET '/movies/Jaws'", function() {
    it("knows about the route", function(done) {
      agent.get('/movies/jaws').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        });
    });

    it("returns an array of movie objects", function(done) {
      agent.get('/movies/jaws').set("Accept", "application/json")
        .expect(200, function(error, result) {
          assert.equal(result.body[0].overview, 'omg sharks!');

          movie_keys;
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        });
    });
  });
}); // top level describe
