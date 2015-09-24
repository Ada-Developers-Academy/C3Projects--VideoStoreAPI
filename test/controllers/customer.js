var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app);

describe("customers controller", function(){

  describe("GET /", function(){
    it("knows about the route", function(done) {
      agent.get("/customers").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          done();
        })
    })

    it("can find a single customer's current rentals", function(done) {
      agent.get("/customers/1/current_rentals").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.current_rentals.length, 1);
          var keys = ["id", "title", "overview", "release_date", "inventory", "available"];
          assert.deepEqual(Object.keys(result.body.current_rentals[0]), keys);
          done();
        })
  })

    it("can find a single customer's rental history", function(done) {
      agent.get("/customers/2/rental_history").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.rental_history.length, 1);
          var keys = ["title", "returned_date", "checked_out"];
          assert.deepEqual(Object.keys(result.body.rental_history[0]), keys);
          done();
        })
    })


    it.only("finds customer subset pages sorted by column", function(done) {
      agent.get("/customers/name/1").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.customer_subset[1].name, "Scully");
          assert.equal(result.body.customer_subset[0].name, "Mulder");
          done();
        })
    })
  })
})
