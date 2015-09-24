"use strict";

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var agent = request.agent(app);

var resetTables = require('../dbCleaner');

describe('/movies', function() {
  describe("GET '/'", function() {
    var numMoviesSeeded;
    var request;

    before(function(done) {
      var data = {
        movies: [
          { title: 'Jaws', overview: 'Shark!', release_date: '1975-06-19', inventory: 10 },
          { title: 'Jaws and Maws', overview: 'Worm!', release_date: '2015-09-12', inventory: 11 },
          { title: 'The French Connection', overview: 'Bonjour!', release_date: '1971-10-07', inventory: 8 }
        ]
      }
      numMoviesSeeded = data.movies.length;
      resetTables(data, done);
    });

    beforeEach(function() {
      request = agent.get('/movies').set('Accept', 'application/json');
    });

    it('responds with json', function(done) {
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('returns all movies in the body', function(done){
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);
          assert.equal(res.body.length, numMoviesSeeded);
          done();
        }
      );
    });

    it('returns an array of movie objects (with the appropriate keys)', function(done) {
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);

          var keys = [ 'id', 'title', 'overview', 'release_date', 'inventory' ];
          assert.deepEqual(Object.keys(res.body[0]), keys);
          done();
        }
      );
    });
  });

  describe("GET '/?sort=title'", function() {
    var numMoviesSeeded;
    var request;

    before(function(done) {
      var data = {
        movies: [
          { title: 'Jaws and Maws', overview: 'Worm!', release_date: '2015-09-12', inventory: 11 },
          { title: 'Jaws', overview: 'Shark!', release_date: '1975-06-19', inventory: 10 },
          { title: 'The French Connection', overview: 'Bonjour!', release_date: '1971-10-07', inventory: 8 }
        ]
      }
      numMoviesSeeded = data.movies.length;
      resetTables(data, done);
    });

    beforeEach(function() {
      request = agent.get('/movies/?sort=title').set('Accept', 'application/json');
    });

    it('responds with json', function(done) {
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('returns all movies sorted by title in the body', function(done){
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);
          assert.equal(res.body.length, numMoviesSeeded);
          assert.equal(res.body[0].title, 'Jaws');
          done();
        }
      );
    });
  });

  describe("GET '/?sort=release_date&n=2'", function() {
    var numMoviesSeeded;
    var request;

    before(function(done) {
      var data = {
        movies: [
          { title: 'Jaws and Maws', overview: 'Worm!', release_date: '2015-09-12', inventory: 11 },
          { title: 'Jaws', overview: 'Shark!', release_date: '1975-06-19', inventory: 10 },
          { title: 'The French Connection', overview: 'Bonjour!', release_date: '1971-10-07', inventory: 8 }
        ]
      }
      numMoviesSeeded = data.movies.length;
      resetTables(data, done);
    });

    beforeEach(function() {
      request = agent.get('/movies/?sort=release_date&n=2').set('Accept', 'application/json');
    });

    it('responds with json', function(done) {
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('returns 2 movies sorted by release_date in the body', function(done){
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);
          assert.equal(res.body.length, 2);
          assert.equal(res.body[0].release_date, '1971-10-07');
          done();
        }
      );
    });
  });

  describe("GET '/?sort=title&n=1&p=2'", function() {
    var numMoviesSeeded;
    var request;

    before(function(done) {
      var data = {
        movies: [
          { title: 'Jaws and Maws', overview: 'Worm!', release_date: '2015-09-12', inventory: 11 },
          { title: 'Jaws', overview: 'Shark!', release_date: '1975-06-19', inventory: 10 },
          { title: 'The French Connection', overview: 'Bonjour!', release_date: '1971-10-07', inventory: 8 }
        ]
      }
      numMoviesSeeded = data.movies.length;
      resetTables(data, done);
    });

    beforeEach(function() {
      request = agent.get('/movies/?sort=title&n=1&p=2').set('Accept', 'application/json');
    });

    it('responds with json', function(done) {
      request
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });

    it('returns 1 movie sorted by title from the second page in the body', function(done){
      request
        .expect(200, function(err, res) {
          assert.equal(err, undefined);
          assert.equal(res.body.length, 1);
          assert.equal(res.body[0].title, 'Jaws and Maws');
          done();
        }
      );
    });
  });
});
