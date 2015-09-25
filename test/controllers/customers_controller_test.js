var request = require('supertest'),
    assert  = require('assert'),
    app     = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    seeder  = require('../../utils/seed'),
    schema  = require('../../utils/schema'),
    agent   = request.agent(app);

describe("Endpoints under /customers", function() {
  beforeEach(function(done) {
    schema(done)
  })

  beforeEach(function(done) {
    seeder(done)
  })

  describe("GET all customers", function() {
    var customers_request;

    beforeEach(function(done) {
      customers_request = agent.get('/customers').set('Accept', 'application/json');
      done();
    })

    it("responds with json", function(done) {
      customers_request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    })

    it("returns an array", function(done) {
      customers_request.expect(200, function(error, result) {
        assert.equal(result.body.length, 7); //the db_cleaner inserted two records

        var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
        assert.deepEqual(Object.keys(result.body[0]), keys);
        done();
      })
    })
  })

  describe("GET a subset of customers", function() {
    var customers_request;

    it("can get subset of customers in name order", function(done) {
      customers_request = agent.get('/customers/sort/name/3/0').set('Accept', 'application/json');
      customers_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);

          var expected_names = ['Aquila Riddle', 'Carolyn Chandler', 'Curran Stout'],
          actual_names = [];

          for(var index in result.body) {
            actual_names.push(result.body[index].name);
          }

          assert.deepEqual(expected_names, actual_names);
          done(error);
        })
    })

    it("can get a subset of customers in registered_at order", function(done){
      customers_request = agent.get('/customers/sort/registered_at/7/0').set('Accept', 'application/json');
      customers_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 7);

          var expected_registered_at = ['Tue, 28 Jan 2014 22:28:45 -0800', 'Wed, 02 Apr 2014 21:44:46 -0700', 'Wed, 16 Apr 2014 21:40:20 -0700', 'Fri, 04 Jul 2014 11:05:11 -0700', 'Fri, 28 Nov 2014 13:14:08 -0800', 'Wed, 29 Apr 2015 07:54:14 -0700', 'Thu, 27 Aug 2015 08:17:24 -0700'],
          actual_registered_at = [];

          for(var index in result.body) {
            actual_registered_at.push(result.body[index].registered_at);
          }

          assert.deepEqual(expected_registered_at, actual_registered_at);

          done(error);
        })
    })

    it("can get a subset of customers in postal_code order", function(done){
      customers_request = agent.get('/customers/sort/postal_code/3/0').set('Accept', 'application/json');
      customers_request
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 3);
          var expected_postal_code = ['15867', '24309', '36134'],
          actual_postal_code = [];

          for(var index in result.body) {
            actual_postal_code.push(result.body[index].postal_code);
          }

          assert.deepEqual(expected_postal_code, actual_postal_code);
          done(error);
        })
    })
  })
})
