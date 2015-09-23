var request = require('supertest'),
    assert  = require('assert'),
    //Movie   = require('../models/movies')
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
        INSERT INTO movies(title, overview, release_date, inventory) \
        VALUES('Jaws', 'Shark!', 'Yesterday', 10), \
              ('Maws', 'Worm!', 'Yesterday', 11), \
              ('Claws', 'Cat!', 'Yesterday', 12), \
              ('Paws', 'Bear!', 'Yesterday', 13), \
              ('Gauze', 'Ouch!', 'Yesterday', 14); \
        COMMIT;"
        , function(err) {
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
});
