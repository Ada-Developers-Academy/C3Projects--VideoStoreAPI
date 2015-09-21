"use strict";

var assert = require("assert");
var Customer = require('../../models/customer');

describe('Customer', function() {
  var customer;
  var dbPath = "db/test.db";
  var numSeeded = 0;

  beforeEach(function(done) {
    customer = new Customer();
    done();
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
