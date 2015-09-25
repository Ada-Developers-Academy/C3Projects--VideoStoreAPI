var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent   = request.agent(app);

describe("rentals controller", function() {

  it("can make a post", function(done) {
   agent.post('/rent/checkin').set('Accept', 'application/json')
     .field('customer_id', '4')
     .field('movie_id', '5')
     .field('total', '5')
     .field('returned_date', '09-24-2015')
     .expect('customer_id', '4')
     done();
  })
})
