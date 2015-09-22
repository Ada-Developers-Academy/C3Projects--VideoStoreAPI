var request = require('supertest'),
assert = require('assert'),
app = require('../../app'),
sqlite3 = require('sqlite3').verbose(),
agent = request.agent(app);

describe("customers controller", function() {

  beforeEach(function(done) {
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        // var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('Shelley Rocha', '2015-09-21', '123 Nope St', 'Seattle', 'WA', '98104', '(000) 000-000', '100'), \
              ('Billy Rocha', '2015-09-21', '123 Nope St', 'Seattle', 'WA', '98104', '(000) 000-000', '100'); \
        COMMIT;", function(err) {
          db_cleaner.close();
          done();
        }
      );
    });

    });

describe("GET '/'", function() {
  it("knows about the route", function(done) {
    agent.get('/customers').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);
       // console.log(err);
      done();
      });
  });

  it("returns an array of customer objects", function(done) {
   agent.get('/customers').set('Accept', 'application/json')
     .expect(200, function(err, result) {
      assert.equal(result.body.length, 2);

      var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
      assert.deepEqual(Object.keys(result.body[0]), keys);
      done();
     });
   }); // returns array objects

  it("knows about the route", function(done) {
    agent.get('/customers/names/Shelley/per_page1/pg0').set('Accept', 'application/json')
      .expect('Content-Type', /application\/json/)
      .expect(200, function(err, res) {
      assert.equal(err, undefined);
       // console.log(err);
      done();
      });
  });

  it("returns the customer object", function(done) {
   agent.get('/customers/names/Shelley/per_page1/pg0').set('Accept', 'application/json')
     .expect(200, function(err, result) {
      assert.equal(result.body.length, 1);

      var keys = ['id', 'name', 'registered_at', 'address', 'city', 'state', 'postal_code', 'phone', 'account_credit'];
      assert.deepEqual(Object.keys(result.body[0]), keys);
      done();
     });
   }); // returns array objects

 }); // describe get
}); // describe customers
