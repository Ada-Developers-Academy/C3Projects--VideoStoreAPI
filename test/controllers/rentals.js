var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app);

describe("rentals controller", function(){
    it("returns customers with overdue rentals", function(done) {
      agent.get("/rentals/overdue").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.overdue_customers.length, 1);
          var keys = ["id", "name", "registered_at", "address", "city", "state", "postal_code", "phone", "account_credit"];
          assert.deepEqual(Object.keys(result.body.overdue_customers[0]), keys);
          done();
      });
    });

    it("returns movie details", function(done) {
      agent.get("/rentals/The%20Lone%20Gunmen").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.movie_details.length, 1);
          var keys = ["id", "title", "overview", "release_date", "inventory", "available"];
          assert.deepEqual(Object.keys(result.body.movie_details[0]), keys);
          assert.equal(result.body.movie_details[0].inventory, 5)
          assert.equal(result.body.movie_details[0].overview,'misadventures of the best nerds')

          done();
      });
    });
});
