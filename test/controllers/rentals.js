var assert = require('assert'),
    sqlite3 = require('sqlite3').verbose(),
    request = require('supertest'),
    app     = require('../../app'),
    movie_controller  = require('../../controllers/rentals'),
    agent   = request.agent(app);

describe("Endpoints under /rentals", function() {
  var db_cleaner;
  
  beforeEach(function(done) {

    db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(title, overview, release_date, inventory, num_available) \
        VALUES('Jaws', 'Shark!', '2015-01-01', 10, 8), \
              ('Maws', 'Worm!', '2015-01-01', 11, 4), \
              ('Claws', 'Cat!', '2015-01-01', 12, 5), \
              ('Paws', 'Bear!', '2015-01-01', 13, 10), \
              ('Gauze', 'Ouch!', '2015-01-01', 14, 10); \
        DELETE FROM customers; \
        INSERT INTO customers(name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES('BeetleJaws', '2015-01-01', '123 street', 'Burlington', \
              'WA', '98233', '(908) 949-6758', 5.25), \
              ('JuiceMaws', '2010-10-10', '123 Lane', 'Mt. Vernon', \
              'WA', '11111', '(908) 949-6758', 10.00); \
        DELETE FROM rentals; \
        INSERT INTO rentals(checkout_date, return_date, movie_id, customer_id, checked_out) \
        VALUES('2015-09-23', '2015-09-30', 1, 1, 'true'), \
              ('2015-09-16', '2015-09-23', 2, 2, 'false'); \
        COMMIT;"
        , function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe("rentals instance methods", function() {
    context("POST /checkout", function() {
      it("can make a post", function(done) {
        agent.post('/checkout').set('Accept', 'application/json')
        .field('title', 'RoboJaws')
        .field('release_date', 'Tomorrow')
        .expect(200);
        done();
      });

      it('posts to the rentals table', function(done) {
        request(app)
          .post('/rentals/checkout')
          .send({ id: '1', title: 'RoboJaws'})
          .expect(200, function(err, res) {
            assert.equal(res.body.customer_id, 1);
            assert.equal(res.body.number_of_records_changed, 1);
            if(err) {
              done(err);
            } else {
              done();
            }
          });
      });
    });

    context("PATCH /checkin", function() {
      it("can update rental records", function(done) {
        agent.patch('/checkin').set('Accept', 'application/json')
        .field('title', 'RoboJaws')
        .field('release_date', 'Tomorrow')
        .expect();
        done();
      });

      it.only('should correctly update an existing account', function(done){
        request(app)
          .patch('/rentals/checkin')
          .send({ id: '1', title: 'RoboJaws'})
          .expect(200, function(err, res) {
            assert.equal(res.body.customer_id, 1);
            console.log(res.body);
            assert.equal(res.body.number_of_records_changed, 1);
            if(err) {
              done(err);
            } else {
              done();
            }
          });
  		});
  	});
  });
});
