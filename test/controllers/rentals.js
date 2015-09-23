var request = require('supertest'),
assert = require('assert'),
app = require('../../app'),
sqlite3 = require('sqlite3').verbose(),
agent = request.agent(app);

describe("Endpoints under /rentals", function() {

  // Reset test.db with test data before each test
  beforeEach(function(done) {
    var db_cleaner = new sqlite3.Database('db/test.db');
    db_cleaner.serialize(function() {
      db_cleaner.exec(
        "BEGIN; \
        DELETE FROM movies; \
        INSERT INTO movies(id, title, overview, release_date, inventory) \
        VALUES(1, 'Jaws', 'Shark!', 'Yesterday', 10), \
              (2, 'Maws', 'Worm!', 'Yesterday', 11), \
              (3, 'Claws', 'Cat!', 'Yesterday', 12), \
              (4, 'Paws', 'Bear!', 'Yesterday', 13), \
              (5, 'Gauze', 'Ouch!', 'Yesterday', 14); \
        DELETE FROM customers; \
        INSERT INTO customers(id, name, registered_at, address, city, state, postal_code, phone, account_credit) \
        VALUES(1, 'Shelly', '2013-09-16', '123 somewhere st', 'Kirkland', 'WA', '98033', '(123)-456-7890', '40'), \
              (2, 'Michelle', '2012-09-19', '234 blvd e', 'Tacoma', 'WA', '98047', '(123)-456-7810', '34'), \
              (3, 'Adam', 2014-09-22, '5 privet dr', 'Little Winging', 'HP', '12345', '(425)-456-7890', '30'), \
              (4, 'Tyler', '2015-09-22', '1600 Pennsylvania ave', 'Yakima', 'WA', '98908', '(360)-123-3345', '24'), \
              (5, 'Brandi', 2011-09-22, '567 your town', 'Seattle', 'WA', '98102', '(206)-456-7890', '10'); \
        DELETE FROM rentals; \
        INSERT INTO rentals(id, check_out_date, check_in_date, expected_return_date, movie_id, customer_id) \
        VALUES(1, '2015-09-15', '2015-09-16', '2015-09-19', 1, 1), \
              (2, '2015-09-16', '2015-09-19', '2015-09-20', 2, 2), \
              (3, '2015-09-17', null, '2015-09-21', 1, 3), \
              (4, '2015-09-18', '2015-09-22', '2015-09-22', 3, 4), \
              (5, '2015-09-19', null, '2015-09-23', 4, 5); \
        COMMIT;",
         function(err) {
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe('GET /rentals', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/rentals')
        .set('Accept', 'application/json');
      done();
    });

    it('responds with json', function(done){
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with correct data', function(done){
      request
        .expect('[{"id":1,"check_out_date":"2015-09-15","check_in_date":"2015-09-16","expected_return_date":"2015-09-19","customer_id":1,"movie_id":1},{"id":2,"check_out_date":"2015-09-16","check_in_date":"2015-09-19","expected_return_date":"2015-09-20","customer_id":2,"movie_id":2},{"id":3,"check_out_date":"2015-09-17","check_in_date":null,"expected_return_date":"2015-09-21","customer_id":3,"movie_id":1},{"id":4,"check_out_date":"2015-09-18","check_in_date":"2015-09-22","expected_return_date":"2015-09-22","customer_id":4,"movie_id":3},{"id":5,"check_out_date":"2015-09-19","check_in_date":null,"expected_return_date":"2015-09-23","customer_id":5,"movie_id":4}]', done);
    });
  });

  describe('GET /rentals/overdue', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/rentals/overdue')
        .set('Accept', 'application/json');
      done();
    });

    it('responds with json', function(done){
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with correct data', function(done){
      request
        .expect('[{"name":"Adam","title":"Jaws"}]', done);
    });
  });


  describe('GET /rentals/currently_out', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/rentals/currently_out')
        .set('Accept', 'application/json');
      done();
    });

    it('responds with json', function(done){
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with correct data', function(done){
      request
        .expect('[{"name":"Adam","title":"Jaws"},{"name":"Brandi","title":"Paws"}]', done);
    });
  });

  describe('GET /rentals/available_inventory', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/rentals/available_inventory')
        .set('Accept', 'application/json');
      done();
    });

    it('responds with json', function(done){
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with correct data', function(done){
      request
        .expect('[{"title":"Jaws","available":9},{"title":"Maws","available":11},{"title":"Claws","available":12},{"title":"Paws","available":12},{"title":"Gauze","available":14}]', done);
    });
  });


  describe('GET /rentals/current_renters/jaws', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/rentals/current_renters/jaws')
        .set('Accept', 'application/json');
      done();
    });

    it('responds with json', function(done){
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with correct data', function(done){
      request
        .expect('[{"name":"Adam"}]', done);
    });
  });

  describe('POST /rentals/check_out', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .post('/rentals/check_out')
        .send({ 'customer_id': '1', 'movie_title': 'Jaws' });
      done();
    });

    it('responds with json', function(done){
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with correct data', function(done){
      request
        .expect('{}', done);
    });

    it('creates a new rental in the database', function(done) {
      var db = new sqlite3.Database('db/test.db');

      request
        .end(function(err, res) {
          db.all("SELECT COUNT(*) AS 'num_of_rentals' FROM rentals", function(error, result) {
            assert.deepEqual([{'num_of_rentals': 6}], result);
            done();
          });
        });
    });
  });
});
