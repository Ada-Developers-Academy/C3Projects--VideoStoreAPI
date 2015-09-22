var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose()
    request = require('supertest'),
    app = require('../../app'),
    agent = request.agent(app);

describe("/customers", function() {
  var test_db;

  beforeEach(function(done) {

    test_db = new sqlite3.Database('db/test.db');
    test_db.serialize(function() {
      test_db.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Jim', 'Wed, 29 Apr 2015 07:54:14 -0700', '1800 Some Place', 'whooville', 'TX', '90210', '555-5555', 17.38), \
              ('Jack', 'Tue, 4 Apr 2015 07:54:14 -0700', '555 Some Where', 'anthill', 'CA', '90210', '123-4444', 19.84); \
        COMMIT;"
        , function(err) {
          test_db.close();
          done();
        }
      );
    });
  })

  describe("GET '/'", function() {
    var customer_request;

    beforeEach(function(done) {
      customer_request = agent.get('/customers').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customer_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array of customer objects", function(done) {
      customer_request.expect(200, function(err, res) {
        assert.equal(res.body.length, 2);

        var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
        assert.deepEqual(Object.keys(res.body[0]), keys);
        done();
      })
    })

  })
})
