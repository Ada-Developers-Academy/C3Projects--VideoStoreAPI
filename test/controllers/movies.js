var request = require('supertest'),
    assert  = require('assert'),
    sqlite3 = require('sqlite3').verbose(),
    app     = require('../../app'),
    agent   = request.agent(app);

describe("Endpoints under /movies", function() {

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
          console.log(err);
          db_cleaner.close();
          done();
        }
      );
    });
  });

  describe('GET /movies', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/movies')
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
        .expect('[{"title":"Jaws","overview":"Shark!","release_date":"Yesterday","inventory":10},{"title":"Maws","overview":"Worm!","release_date":"Yesterday","inventory":11},{"title":"Claws","overview":"Cat!","release_date":"Yesterday","inventory":12},{"title":"Paws","overview":"Bear!","release_date":"Yesterday","inventory":13},{"title":"Gauze","overview":"Ouch!","release_date":"Yesterday","inventory":14}]', done);
    });
  });

  describe('GET /movies/id/:id', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/movies/id/1')
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
        .expect('[{"title":"Jaws","overview":"Shark!","release_date":"Yesterday","inventory":10}]', done);
    });
  });

  describe('GET /movies/title/:title/inventory', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/movies/title/Jaws/inventory')
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
        .expect('[{"title":"Jaws","inventory":10}]', done);
    });
  });

  describe('GET /movies/title/:title', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/movies/title/Paws')
        .set('Accept', 'application/json');
      done();
    });

    it('responds with json', function(done){
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with json (different casing of title)', function(done){
      agent
        .get('/movies/title/pAwS')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('responds with correct data', function(done){
      request
        .expect('[{"title":"Paws","overview":"Bear!","release_date":"Yesterday","inventory":13}]', done);
    });

    it('responds with correct data (different casing of title)', function(done){
      agent
        .get('/movies/title/pAwS')
        .set('Accept', 'application/json')
        .expect('[{"title":"Paws","overview":"Bear!","release_date":"Yesterday","inventory":13}]', done);
    });
  });

  describe('GET /movies/release_date?n=XXX&p=XXX', function(){

    it('handles no n and no p', function(done){
      agent
        .get('/movies/release_date')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[{"title":"Jaws","release_date":"Yesterday"},{"title":"Maws","release_date":"Yesterday"},{"title":"Claws","release_date":"Yesterday"},{"title":"Paws","release_date":"Yesterday"},{"title":"Gauze","release_date":"Yesterday"}]', done);
    });

    it('handles n=0', function(done){
      agent
        .get('/movies/release_date?n=0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[]', done);
    });

    it('handles n=1', function(done){
      agent
        .get('/movies/release_date?n=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[{"title":"Jaws","release_date":"Yesterday"}]', done);
    });

    it('handles n=2', function(done){
      agent
        .get('/movies/release_date?n=2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[{"title":"Jaws","release_date":"Yesterday"},{"title":"Maws","release_date":"Yesterday"}]', done);
    });

    it('handles n=0, p=1', function(done){
      agent
        .get('/movies/release_date?n=0&p=1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[]', done);
    });

    it('handles n=1, p=3', function(done){
      agent
        .get('/movies/release_date?n=1&p=3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[{"title":"Claws","release_date":"Yesterday"}]', done);
    });

    it('handles n=2, p=2', function(done){
      agent
        .get('/movies/release_date?n=2&p=2')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[{"title":"Claws","release_date":"Yesterday"},{"title":"Paws","release_date":"Yesterday"}]', done);
    });

    it('handles n=2, p=3', function(done){
      agent
        .get('/movies/release_date?n=2&p=3')
        .set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200)
        .expect('[{"title":"Gauze","release_date":"Yesterday"}]', done);
    });
  });

  describe('GET /movies/title/:title/checked_out_current', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/movies/title/Jaws/checked_out_current')
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
        .expect('[{"id":3,"name":"Adam","phone":"(425)-456-7890","check_out_date":"2015-09-17"}]', function(err, res){
          done(err);
        });
    });
  });

  describe('GET /movies/title/:title/checked_out_history', function(){
    var request;
    beforeEach(function(done) {
      request = agent
        .get('/movies/title/Jaws/checked_out_history')
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
        .expect('[{"id":1,"name":"Shelly","phone":"(123)-456-7890","check_out_date":"2015-09-15"}]', done);
      });
    });
});
