var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    express = require('express');

describe("Endpoints for /customers", function() {
  beforeEach(function(done){
    var db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM customers; \
        INSERT INTO customers(id, name, registered_at, address, city, state, postal_zip, phone_number, credit)\
        VALUES(1, 'Alice', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 10.14),\
              (2, 'Shanna', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 20.16),\
              (3, 'Marleigh', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 8.53),\
              (4, 'Joe', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 92.42),\
              (5, 'Steve', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 2.34);\
        COMMIT;",
          function(err) {
            db_cleaner.close();
            done();
          }
      );
    });
  })

// '/customers'

// '/customers/:name/:results_per_page/:page_number'
// '/customers/:registered_at/:results_per_page/:page_number'
// '/customers/:postal_code/:results_per_page/:page_number'
// '/customers/:id/current'
// '/customers/:id/previous'










});
