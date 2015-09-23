'use strict';

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var sqlite3 = require('sqlite3').verbose();
var agent = request.agent(app);
var movieController = require('../../controllers/movie_controller');

// Run  `DB=test npm run db:schema' and 'DB=test npm run db:seeds` to seed before running these tests

describe('movie controller', function() {
  describe('GET /all/:page', function() {
    var uri = '/movies/all/1';

    it('responds with json format', function(done) {
      agent.get(uri).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(error, result) {
        assert.equal(error, undefined);
        done();
      })
    })

    it('responds with 10 movie results', function(done) {
      agent.get(uri).set('Accept', 'application/json')
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 10);
          assert.equal(error, undefined);
          done();
        })
    })

    it("responds with keys of 'id', \
      'title', 'overview', 'release_date' and 'inventory'",
      function(done) {

      var movie_keys = [
        'title',
        'overview',
        'release_date',
        'inventory'
      ];

      agent.get(uri).set('Accept', 'application/json')
      .expect(200, function(error, result) {
        assert.deepEqual(Object.keys(result.body[0]), movie_keys);
        done();
      })
    })
  }) // GET /movies

  describe("GET /:title", function() {
    var title = "Alien";
    var uri = '/movies/' + title;

    it('responds with json format', function(done) {
      agent.get(uri).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(error, result) {
        assert.equal(error, undefined);
        done();
      })
    })

    it('responds with 1 movie result', function(done) {
      agent.get(uri).set('Accept', 'application/json')
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          assert.equal(result.body.length, 1);
          done();
        })
    })

    it("responds with keys of 'title','overview', 'release_date' and 'inventory'", function(done) {

      var movie_keys = [
        'title',
        'overview',
        'release_date',
        'inventory'
      ];

      agent.get(uri).set('Accept', 'application/json')
        .expect(200, function(error, result) {
          assert.deepEqual(Object.keys(result.body[0]), movie_keys);
          done();
        })
    })

  }) // GET /movies/:title

  describe('GET /:title/renting', function() {
    var uri = '/movies/Alien/renting';

    it('responds with json format', function(done) {
      agent.get(uri).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(error, result) {
        assert.equal(error, undefined);
        done();
      })
    })

    it("responds with keys of 'customer_name', \
      'check_out_date', and 'movie_title'",
      function(done) {
        var customer_movies = [
          'name',
          'check_out_date',
          'movie_title'
        ];

        agent.get(uri).set('Accept', 'application/json')
          .expect(200, function(error, result) {
            assert.deepEqual(Object.keys(result.body[0]), customer_movies);
            done();
          })
    })
  })

  describe('GET /:title/rented/sort_by=:query/:page', function() {
    var title = "Alien";
    var sorting_hat = [
      "customer_id",
      "customer_name",
      "check_out_date"
    ];
    var customer_movies = [
      'name',
      'check_out_date',
      'movie_title'
    ];

    sorting_hat.forEach(function(query) {
      var uri = '/movies/' + title + '/rented/sort_by=' + query + '/1';
      it('responds with json format', function(done) {
        console.log(uri);

        agent.get(uri).set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, function(error, result) {
            assert.equal(error, undefined);
            done();
          })
      })
      it('responds with an array of customers', function(done) {
        agent.get(uri).set('Accept', 'application/json')
          .expect(200, function(error, result) {
            assert.equal(error, undefined);
            assert.deepEqual(Object.keys(result.body[0]), customer_movies);
            done();
          })
      })
    }) // forEach loop
  }) // GET /:title/rented/sort_by=:query/:page

  describe('GET /all/sort_by=:sort/:page', function() {
    var sorting_cap = [
      'title',
      'release_date'
    ];

    var movie_keys = [
      'title',
      'release_date',
      'overview',
      'inventory'
    ]

    sorting_cap.forEach(function(sort) {
      var uri = '/movies/all/sort_by=' + sort + '/1';

      it('responds with a json object', function(done) {
        agent.get(uri).set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
          done();
        })
      })

      it('responds with an array of movies', function(done) {
        agent.get(uri).set('Accept', 'application/json')
        .expect(200, function(error, result) {
          assert.deepEqual(Object.keys(result.body[0]).sort(), movie_keys.sort())
          done();
        })
      })

      it('responds with 10 movies', function(done) {
        agent.get(uri).set('Accept', 'application/json')
        .expect(200, function(error, result) {
          assert.equal(result.body.length, 10)
          done();
        })
      })

    }) //forEach loop
  }) // /all/sort_by=:sort/:page
}) // moviecontroller describe
