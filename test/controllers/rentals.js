var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app);

//   describe('Rental', function() {
//     var rental,
//     db_cleaner;

//   afterEach(function(done) {
//       rental = new Rental();

//       db_cleaner = new sqlite3.Database('db/test.db');
//       db_cleaner.serialize(function() {

//       db_cleaner.exec("BEGIN; DELETE FROM rentals; COMMIT;", function(err) {

//         db_cleaner.close();
//         done();
//         }
//       );
//     });
//   });
// });


describe("rentals controller", function(){
    it("returns customers with overdue rentals", function(done) {
      agent.get("/rentals/overdue").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.overdue_customers.length, 1);
          var keys = ["id", "name", "registered_at", "address", "city", "state", "postal_code", "phone", "account_credit"];
          assert.deepEqual(Object.keys(result.body.overdue_customers[0]), keys);
          done();
      });
    });

    it("returns movie details", function(done) {
      agent.get("/rentals/The%20Lone%20Gunmen").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.movie_details.length, 1);
          var keys = ["id", "title", "overview", "release_date", "inventory", "available"];
          assert.deepEqual(Object.keys(result.body.movie_details[0]), keys);
          assert.equal(result.body.movie_details[0].inventory, 5)
          assert.equal(result.body.movie_details[0].overview,'misadventures of the best nerds')

          done();
      });
    });

    it("returns current customers who are renting movie", function(done) {
      agent.get("/rentals/X-files:%20I%20want%20to%20believe/customers").set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, function(error, result){
          assert.equal(error, undefined);
          assert.equal(result.body.rental_customers.length, 1);
          var keys = ["id", "name", "registered_at", "address", "city", "state", "postal_code", "phone", "account_credit"];
          assert.deepEqual(Object.keys(result.body.rental_customers[0]), keys);
          assert.equal(result.body.rental_customers[0].name, "Mulder")
          done();
      });
    });

    describe("rentals check-in", function(){
      it("updates a movie's availability", function(done) {
        agent.post("/rentals/new_rental/1/Fight%20The%20Future").set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result){
            assert.equal(error, undefined);

            var db = new sqlite3.Database('db/test.db');

          db.serialize (function () {
            db.all("SELECT available FROM movies WHERE title= 'Fight the Future';", function(err, record) {
                new_value = (record[0].available);
                assert.equal(new_value, 6)
                done();
            });
          });
        });
      });
    });

    it("inserts a new rental into the rental database", function(done) {
        agent.post("/rentals/new_rental/1/The%20Lone%20Gunmen").set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result){
            assert.equal(error, undefined);

            var db = new sqlite3.Database('db/test.db');

          db.serialize (function () {
            db.all("SELECT * FROM rentals;", function(err, record) {
                assert.equal(record.length, 3);
                done();
            });
          });
        });
      });

      it("charges the customer", function(done) {
        agent.post("/rentals/new_rental/2/X-files:%20I%20want%20to%20believe").set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result){
            assert.equal(error, undefined);
            assert.equal(result.body.new_rental, "You've successfully charged the customer.");

            var db = new sqlite3.Database('db/test.db');

          db.serialize (function () {
            db.all("SELECT account_credit FROM customers WHERE id=2;", function(err, record) {
                assert.equal(record[0].account_credit, 6.0);
                done();
            });
          });
        });
      });


      it("checks in a movie and updates movie availability", function(done) {
        agent.put("/rentals/check_in/1/X-files:%20I%20want%20to%20believe").set('Accept', 'application/json')
          .expect('Content-Type', /application\/json/)
          .expect(200, function(error, result){
            assert.equal(error, undefined);

          var db = new sqlite3.Database('db/test.db');

          db.serialize (function () {
            db.all("SELECT * FROM rentals WHERE customer_id= 1 AND movie_id =(SELECT id FROM movies WHERE title='X-files: I want to believe');", function(err, record) {
                var today = new Date().toISOString().slice(0, 10);
                assert.equal(record[0].returned_date, today);
                done();
            });
          });
        });
      });
    });

