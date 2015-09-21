"use strict";

var assert = require("assert");
var sqlite3 = require('sqlite3').verbose();
var Customer = require('../../models/customer');

describe('Customer', function() {
  var customer;
  var dbPath = "db/test.db";
  var numSeeded = 2;

  beforeEach(function(done) {
    customer = new Customer();
    resetCustomersTable(done);
  });

  it('can be instantiated', function() {
    assert.equal(customer instanceof Customer, true);
  });

  it('holds onto the `path` to the database', function() {
    assert.equal(customer.dbPath(), dbPath);
  });

  describe('#create', function() {
    it('creates a new customer record', function(done) {
     var data = {
      name: 'Customer1',
      registered_at: 'Yesterday',
      address: '1234 Nowhere St',
      city: 'Nowhereville',
      state: 'NW',
      postal_code: '12345',
      phone: '123-456-7890',
      account_balance: '20.45'
    }

     customer.create(data, function(err, res) {
       assert.equal(err, undefined);
       assert.equal(res.insertedID, numSeeded + 1);
       assert.equal(res.changed, 1);
       done();
     });
    });
  });
});

function resetCustomersTable(done) {
  var db = new sqlite3.Database('db/test.db');
  db.serialize(function() {
    db.exec(
      "BEGIN; \
      DELETE FROM customers; \
      INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_balance) \
      VALUES('Customer1', '01/02/2015', 'Address1', 'City1', 'State1', 'Zip1', 'Phone1', '1250'), \
            ('Customer2', '12/01/2014', 'Address2', 'City2', 'State2', 'Zip2', 'Phone2', '1000'); \
      COMMIT;",
      function(err) {
        db.close();
        done();
      }
    );
  });
}
