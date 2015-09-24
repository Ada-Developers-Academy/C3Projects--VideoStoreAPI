var request = require('supertest'),
    assert = require('assert'),
    app = require('../../app'),
    sqlite3 = require('sqlite3').verbose(),
    agent = request.agent(app),
    express = require('express');

    describe("Endpoints for /movies", function() {
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
            COMMIT;",
              function(err) {
                db_cleaner.close();
                done();
              }
          );
        });
      })

      // '/movies'
      describe('GET /movies', function(){
        var movieRequest;

        beforeEach(function(done){
          movieRequest = get('/movies').set('Accept', 'application/json');
          done();
        })

        it('responds with json', function(done){
          movieRequest.expect('Content-Type', /application\/json/)
                      .expect(200, function(error, result) {
                        assert.equal(error, undefined);
                        done();
                      });
        });

        it('returns an array of movie objects', function(done){
          movieRequest.expect(200, function(error, result) {
                        assert.equal(result.body.length, 5);

                        var keys = ['id' ,'title', 'overview', 'release_date', 'total_inventory', 'inventory_available'];

                        assert.deepEqual(Object.keys(result.body[0]), keys);
                        done();
          })
        });
      });


      // '/movies/:sort_by/:results_per_page/:page_number'
      describe('GET /movies/:sort_by/:results_per_page/:page_number', function(){
        it('responds with json', function(done){
          agent.get('/movies/title/4/1')
               .set('Accept', 'application/json')
               .expect('Content-Type', /application\/json/)
               .expect(200, function(error, result) {
                  assert.equal(error, undefined);
                  done();
                });
        });

        it('returns an array of movie objects', function(done){
          agent.get('/movies/title/4/1')
               .set('Accept', 'application/json')
               .expect(200, function(error, result) {
                  assert.equal(result.body.length, 4);

                var keys = ['id' ,'title', 'overview', 'release_date', 'total_inventory', 'inventory_available'];
                assert.deepEqual(Object.keys(result.body[0]), keys);
                done();
          })
        });

        it('returns an array of movie objects sorted by title', function(done){
          agent.get('/movies/title/5/1')
               .set('Accept', 'application/json')
               .expect(200, function(error, result) {
                  assert.equal(result.body.length, 5);

                var expectedTitles = ['Carrie', 'Christine', 'Cujo', 'Jaws', 'Psycho'];
                var actualTitles = [];

                for(var i = 0; i < result.body.length; i++) {
                  actualTitles.push(result.body[i].title);
                }

                assert.deepEqual(expectedTitles, actualTitles);
                done();
          })
        })

        it('returns an array of movie objects sorted by release_date', function(done){
          agent.get('/movies/release_date/5/1')
               .set('Accept', 'application/json')
               .expect(200, function(error, result) {
                  assert.equal(result.body.length, 5);

                var expectedTitles = ['Psycho', 'Carrie','Christine','Jaws', 'Cujo'];
                var actualTitles = [];

                for(var i = 0; i < result.body.length; i++) {
                  actualTitles.push(result.body[i].title);
                }

                assert.deepEqual(expectedTitles, actualTitles);
                done();
          })
        })

        it('returns the number of results specified', function(done){
          agent.get('/movies/release_date/3/1')
               .set('Accept', 'application/json')
               .expect(200, function(error, result) {
                  assert.equal(result.body.length, 3);

                done();
          })
        })

        it('returns the correct page', function(done){
          agent.get('/movies/title/2/2')
               .set('Accept', 'application/json')
               .expect(200, function(error, result) {

                  var expectedTitles = ['Cujo', 'Jaws'];
                  var actualTitles = [];

                  for(var i = 0; i < result.body.length; i++) {
                   actualTitles.push(result.body[i].title);
                  }

                  assert.deepEqual(expectedTitles, actualTitles);
                  done();
          })
        })
      });


      // '/movies/:title'
      describe("GET /movies/:title", function(){
        var movieRequest;

        beforeEach(function(done){
          movieRequest = agent.get('/movies/jaw').set('Accept', 'application/json');
          done();
        })

        it('responds with json', function(done){
          movieRequest.expect('Content-Type', /application\/json/)
                      .expect(200, function(error, result) {
                        assert.equal(error, undefined);
                        done();
                      });
        });

        it('returns an array of movie objects', function(done){
          movieRequest.expect(200, function(error, result) {
                        assert.equal(result.body.length, 1);

                        var keys = ['id' ,'title', 'overview', 'release_date', 'total_inventory', 'inventory_available'];
                        assert.deepEqual(Object.keys(result.body[0]), keys);
                        done();
          })
        });

        it('will return the movie that is most similar to search term', function(done){
          agent.get('/movies/ja')
               .set('Accept', 'application/json')
               .expect(200, function(error, result) {
                  assert.equal(result.body.length, 1);

                  var expectedTitle = ['Jaws'];
                  var actualTitle = [];
                  actualTitle.push(result.body[0].title);

                  assert.deepEqual(expectedTitle, actualTitle)
                  done();
          })
        })
      })
    })
