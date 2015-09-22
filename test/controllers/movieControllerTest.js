'use strict';

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var sqlite3 = require('sqlite3').verbose();
var agent = request.agent(app);
var movieController = require('../../controllers/movieController');

describe('movie controller', function() {
  describe.only('GET /movies/all/:page', function() {
    it('responds with json format', function(done) {
      agent.get('/movies/all/1').set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, function(error, result) {
        assert.equal(error, undefined);
      })
      done();
    })

    it('responds with 10 movie results', function(done) {
      agent.get('/movies/all/1').set('Accept', 'application/json')
        .expect('Content-Length', '10')
        .expect(200, function(error, result) {
          assert.equal(error, undefined);
        })
      done();
    })

    it("responds with keys of 'id', \
      'title', 'overview', 'release_date' and 'inventory'",
      function(done) {

      var movie_keys = [
        'id',
        'title',
        'overview',
        'release_date',
        'inventory'
      ];

      agent.get('/movies/all/1').set('Accept', 'application/json')
      .expect(200, function(error, result) {
        assert.deepEqual(Object.keys(result.body[0]), movie_keys);
      })
      done();

    })
  }) // GET /movies


}) // moviecontroller describe
