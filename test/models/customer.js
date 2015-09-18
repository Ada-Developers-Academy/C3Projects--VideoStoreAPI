"use strict";

var assert = require('assert'),
  Customer = require('../../models/customer'),
  sqlite3 = require('sqlite3').verbose();

describe('Customer', function() {
  var customer,
   db_cleaner;

 beforeEach(function(done) {
   customer = new Customer();

   db_cleaner = new sqlite3.Database('db/test.db');
   db_cleaner.serialize(function() {
     db_cleaner.exec(
       "BEGIN; \
       DELETE FROM customers; \
       INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
       VALUES('Mulder', 'yesterday', '123', 'DC', 'DC', '834885', '49583', 5), \
             ('Scully', 'last week', 'DC', 'DC', '2342', '534', 7); \
       COMMIT;"
       , function(err) {
         db_cleaner.close();
         done();
       }
     );
   });
 })

  it("can be instantiated", function(){
    assert(customer instanceof Customer);
  });

  


})
