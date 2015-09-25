var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app),
    schema  = require('../../utils/schema'),
    seeder  = require('../../utils/seed');

describe.only("rental controller", function() {
  beforeEach(function(done) {
    schema(done)

  })

  // beforeEach(function(done) {
  //   seeder(done)

  // })


  it("POST /rent/checkout", function(done) {
    agent.post('/rent/checkout').set('Accept', 'application/json')
      .send('customer_id', 3)
      .send('movie_id', 2)
      .send('rental_time', 2)
      .send('cost', 2.50)
      .expect(200, done)
      // .expect(200, function(error, result) {
      //   console.log(error);
      //   assert.equal(error, undefined)
      //   console.log(result);
      //   assert.equal(result.customer_id, 2);
      //   assert.equal(result.status, 200);
      //   done(error);
      // })

  })
})

