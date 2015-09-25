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

  // beforeEach(function(done) {
  //   schema(done)
  // })

  describe("GET all movies", function() {
    var movie_request;

    beforeEach(function(done) {
      console.log("HITHERE")
      movie_request = agent.get('/movies').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      // console.log("HITHERE")
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })


    it("returns an array", function(done) {
      movie_request.expect(200, function(error, result) {
        assert.equal(result.body.length, 5); //the db_cleaner inserted two records

        var keys = ['id', 'title', 'overview', 'release_date', 'inventory'];
        assert.deepEqual(Object.keys(result.body[0]), keys);
        done();
      })
    })
  })

  describe("GET a subset of movies", function() {
    var movie_request;

    it("can get subset of movies in title order", function(done) {
      movie_request = agent.get('/movies/n/3/o/1/s/title').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);

          var expected_names = ['Gauze', 'Jaws', 'Maws'],
          actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].title);
          }

          assert.deepEqual(expected_names, actual_names);
          done(error);
        })
    })

    it("can get a subset of movies in release_date order", function(done){
      movie_request = agent.get('/movies/n/3/o/1/s/release_date').set('Accept', 'application/json');
      movie_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);
          var expected_names = ['Claws', 'Maws', 'Gauze'],
          actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].title);
          }

          assert.deepEqual(expected_names, actual_names);

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

          var keys = ['id', 'title', 'overview', 'release_date', 'inventory'];
          assert.deepEqual(Object.keys(result.body[0]), keys);

          assert.equal(result.body[0].title, 'Jaws');
          done();
        });
    })
  })
})


