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
});
