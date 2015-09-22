var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app);

describe("rentals controller", function() {
  describe("GET '/rentals'", function() {
    it("knows about the route", function(done) {
      agent.get('/rentals').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        })
    })
  })
})
