var assert   = require('assert'),
    sqlite3  = require('sqlite3').verbose(),
    customer = require('../../models/customers');

describe("Customer", function() {
  var a_customer;
  var db_cleaner;

  beforeEach(function(done) {
    a_customer = new Customer();
    
    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(

      )
    })
  })
})
