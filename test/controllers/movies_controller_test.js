var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    seeder  = require('../../utils/seed'),
    schema  = require('../../utils/schema'),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {
  beforeEach(function(done) {
    schema(done)
  })

  beforeEach(function(done) {
    seeder(done)
  })

  describe("GET all movies", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array", function(done) {
      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.length, 6); //the db_cleaner inserted two records

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'available'];
        assert.deepEqual(Object.keys(result.body[0]), keys);
        done();
      })
    })
  })

  describe("GET a subset of movies", function() {
    var movie_request;

    it("can get subset of movies in title order", function(done) {
      movie_request = agent.get('/movies/sort/title/4/0').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 4);

          var expected_names = ['Alien', 'Jaws', 'North by Northwest', 'Psycho'],
          actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].title);
          }

          assert.deepEqual(expected_names, actual_names);
          done(error);
        })
    })

    it("can get a subset of movies in release_date order", function(done){
      movie_request = agent.get('/movies/sort/release_date/4/0').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 4);
          var expected_release_date = ['1959-07-17', '1960-06-16', '1973-12-26', '1975-06-19'],
          actual_release_date = [];

          for(var index in result.body) {
            actual_release_date.push(result.body[index].release_date);
          }

          assert.deepEqual(expected_release_date, actual_release_date);

          done(error);
        })
    })
  })

  describe("GET /movies/:title", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies/Jaws').set('Accept', 'application/json');
      done();
    })

    it("can find jaws", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);

          var keys = ['id', 'title', 'overview', 'release_date', 'inventory', 'available'];
          assert.deepEqual(Object.keys(result.body[0]), keys);

          assert.equal(result.body[0].title, 'Jaws');
          done();
        });
    })
  })

  describe("GET /movies/:title/available", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies/Jaws/available').set('Accept', 'application/json');
      done();
    })

    it("displays available quantity of jaws", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);

          var keys = ['title', 'available'];
          assert.deepEqual(Object.keys(result.body[0]), keys);

          assert.equal(result.body[0].available, '6');
          done();
        });
    })
  })


  describe("GET /movies/:title/customers/current", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies/Jaws/customers/current').set('Accept', 'application/json');
      done();
    })

    it("displays current customers of jaws", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 1);

          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(result.body[0]), keys);

          assert.equal(result.body[0].name, 'Curran Stout');
          done();
        });
    })
  })

  describe("GET /movies/:title/customers/past/sort_by_id", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies/The Exorcist/customers/past/sort_by_id').set('Accept', 'application/json');
      done();
    })

    it("displays past customers of the Exorcist, sorted by id", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(result.body[0]), keys);

          assert.equal(result.body[0].name, 'Shelley Rocha');
          assert.equal(result.body[1].name, 'Carolyn Chandler');
          done();
        });
    })
  })

  describe("GET /movies/:title/customers/past/sort_by_name", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies/The Exorcist/customers/past/sort_by_name').set('Accept', 'application/json');
      done();
    })

    it("displays past customers of the Exorcist, sorted by name", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
          assert.deepEqual(Object.keys(result.body[0]), keys);

          assert.equal(result.body[0].name, 'Carolyn Chandler');
          assert.equal(result.body[1].name, 'Shelley Rocha');
          done();
        });
    })
  })

  describe("GET /movies/:title/customers/past/sort_by_checkout_date", function() {
    var movie_request;

    beforeEach(function(done) {
      movie_request = agent.get('/movies/The Exorcist/customers/past/sort_by_checkout_date').set('Accept', 'application/json');
      done();
    })

    it("displays past customers of the Exorcist, sorted by checkout_date", function(done) {
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 2);

          var keys = ['name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit', 'checkout_date'];
          assert.deepEqual(Object.keys(result.body[0]), keys);
          console.log(result.body)

          assert.equal(result.body[0].checkout_date, '09-22-2015');
          assert.equal(result.body[1].checkout_date, '09-20-2015');
          done();
        });
    })
  })
})
