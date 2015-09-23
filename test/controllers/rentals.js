var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    express = require('express');

describe("Endpoints for /rentals", function() {
  beforeEach(function(done){
    var db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(id, title, overview, release_date, total_inventory, inventory_available) \
        VALUES(1, 'Jaws', 'scary shark', '1984', 5, 3), \
              (2, 'Psycho', 'scary dude', '1960', 10, 9), \
              (3, 'Carrie', 'scary chick', '1970', 7, 1), \
              (4, 'Cujo', 'scary dog', '1987', 2, 0), \
              (5, 'Christine', 'scary car', '1982', 4, 2); \
        DELETE FROM customers; \
        INSERT INTO customers(id, name, registered_at, address, city, state, postal_zip, phone_number, credit)\
        VALUES(1, 'Alice', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 10.14),\
              (2, 'Shanna', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 20.16),\
              (3, 'Marleigh', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 8.53),\
              (4, 'Joe', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 92.42),\
              (5, 'Steve', 'Fri, 18 Aug 2015 07:00:00 -0700', '123 Fake St.', 'Seattle', 'WA', 98102, '123-444-5555', 2.34);\
        DELETE FROM rentals; \
        INSERT INTO rentals(id, customer_id, customer_name, movie_id, return_date, checkout_date, due_date) \
        VALUES(1, 1, 2, 'Alice', 'Fri, 18 Aug 2015 07:00:00 -0700', 'Wed, 14 Aug 2015 10:00:00 -0700', 'Wed, 21 Aug 2015 10:00:00 -0700'), \
              (2, 1, 2, 'Alice', '', 'Wed, 22 Jul 2015 10:00:00 -0700', 'Wed, 29 Jul 2015 10:00:00 -0700'), \
              (3, 2, 2, 'Shanna', '', 'Tue, 7 Sep 2015 10:00:00 -0700', 'Tue, 14 Sep 2015 10:00:00 -0700'), \
              (4, 2, 5, 'Shanna', 'Tue, 7 Sep 2015 10:00:00 -0700', 'Tue, 1 Sep 2015 10:00:00 -0700', 'Tue, 8 Sep 2015 10:00:00 -0700'), \
              (5, 3, 1, 'Marleigh', '', 'Fri, 18 Sep 2015 10:00:00 -0700', 'Fri, 25 Sep 2015 10:00:00 -0700'); \
        COMMIT;",
          function(err) {
            db_cleaner.close();
            done();
          }
      );
    });
  })


  // '/rentals/:title/current/:sort_option'
  describe('GET /rentals/:title/current/:sort_option', function(){

    it('responds with json', function(done){
      agent.get('/rentals/Psycho/current/customer_id')
           .set('Accept', 'application/json')
           .expect('Content-Type', /application\/json/)
           .expect(200, done);
    })

    // it('returns an array of rental objects', function(done){
    //
    // });
    //
    // it('returns an array of rental objects sorted by customer id', function(done){
    //
    // });
    //
    // it('returns an array of rental objects sorted by customer name', function(done){
    //
    // });
    //
    //
    // it('returns an array of rental objects sorted by checkout date', function(done){
    //
    // });
  });



  // '/rentals/:title/past/:sort_option'
  // describe('GET /rentals/:title/past/:sort_option', function(){
  //   it('responds with json', function(done){
  //
  //   });
  //
  //   it('returns an array of rental objects', function(done){
  //
  //   });
  //
  //   it('returns an array of rental objects sorted by id, name checkout date', function(done){
  //
  //   });
  //
  //   it('returns an array of rental objects sorted by name', function(done){
  //
  //   });
  //
  //   it('returns an array of rental objects sorted by checkout date', function(done){
  //
  //   });
  // });


  // '/rentals/overdue'
  // *GET*  rental/:title/available
  // *POST* rental/:title/:customer_id/checkin
  // *POST* rental/:title/:customer_id/checkout







});
