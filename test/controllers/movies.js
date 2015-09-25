var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app);

describe("movies controller", function(){
  describe("GET /", function(){
    it("knows about the route", function(done) {
      agent.get("/movies").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          done();
      });
    });
  });

  it("returns customers who have rented movie in the past", function(done) {
      agent.get("/movies/The%20Lone%20Gunmen/past_rentals/title").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.movie_past_customers.length, 1);
          var keys = ["id", "name", "registered_at", "address", "city", "state", "postal_code", "phone", "account_credit"];
          assert.deepEqual(Object.keys(result.body.movie_past_customers[0]), keys);
          assert.equal(result.body.movie_past_customers[0].name, "Scully");
          done();
      });
  });

  it("returns customers who currently have movie rented", function(done) {
      agent.get("/movies/X-files:%20I%20want%20to%20believe/current_rentals").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.movie_current_customers.length, 1);
          var keys = ["id", "name", "registered_at", "address", "city", "state", "postal_code", "phone", "account_credit"];
          assert.deepEqual(Object.keys(result.body.movie_current_customers[0]), keys);
          assert.equal(result.body.movie_current_customers[0].name, "Mulder");
          done();
      });
  });

  it("returns subset of movies sorted by title", function(done) {
      agent.get("/movies/title/page0").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.movie_subset.length, 3);
          assert.equal(result.body.movie_subset[0].title, "Fight the Future")
          assert.equal(result.body.movie_subset[1].title, "The Lone Gunmen")
          assert.equal(result.body.movie_subset[2].title, "X-files: I want to believe")
          done();
      });
  });

  it("returns subset of movies sorted by release_date", function(done) {
      agent.get("/movies/release_date/page0").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.movie_subset.length, 3);
          assert.equal(result.body.movie_subset[0].release_date, "1998")
          assert.equal(result.body.movie_subset[1].release_date, "2001")
          assert.equal(result.body.movie_subset[2].release_date, "2007")
          done();
      });
  });
});
