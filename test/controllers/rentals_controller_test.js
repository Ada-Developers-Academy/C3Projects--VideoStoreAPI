var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("rentals controller", function() {
 // describe("GET '/'", function() {
 //   it("knows about the route", function(done) {
 //     agent.get('/rentals').set('Accept', 'application/json')
 //       .expect('Content-Type', /application\/json/)
 //       .expect(200, function(error, result) {
 //         assert.equal(error, undefined);
 //         done()
 //       })
 //   })

   it.only("can make a post", function(done) {
     agent.post('/rent/checkin').set('Accept', 'application/json')
       .field('customer_id', '4')
       .field('movie_id', '5')
       .field('total', '5')
       .field('returned_date', '09-24-2015')
       .expect('customer_id', '4')
      //  console.log(response);
       done();
   })

  //  it("returns an array of rentals objects", function(done) {
  //    agent.get('/rent/checkin').set('Accept', 'application/json')
  //      .expect(200, function(err, result) {
  //        assert.equal(result.body.length, 2);
   //
  //        var keys = ['id', 'title', 'overview', 'release_date', 'inventory'];
  //        assert.deepEqual(Object.keys(result.body[0]), keys);
  //        done();
  //      })
  //  })
 // })
})
