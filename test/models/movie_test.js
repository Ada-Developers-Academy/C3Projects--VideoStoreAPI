"use strict";

var assert = require("assert");
var Movie = require('../../models/movie');
var resetTables = require('../dbCleaner');

describe('Movie', function() {
  var movie = new Movie();

  it("can be instantiated", function() {
    assert(movie instanceof Movie);
  });

  it("holds onto the `path` to the database", function() {
    assert.equal(movie.dbPath(), "db/test.db");
  });

  describe('#create', function() {
    function validMovieData() {
      return {
        title: 'RoboJaws',
        overview: 'Jaws is hunted by RoboJaws',
        release_date: 'Tomorrow',
        inventory: 10
      };
    };

    beforeEach(function(done) {
      resetTables({}, done);
    });

    it('creates a new movie record', function(done) {
      var data = validMovieData();

      movie.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, 1);
        assert.equal(res.changed, 1);
        done();
      });
    });

    it('requires a title', function(done) {
      var data = validMovieData();
      delete data.title;

      movie.create(data, function(err, res) {
        assert.equal(err.errno, 19);
        assert.equal(err.message, 'SQLITE_CONSTRAINT: NOT NULL constraint failed: movies.title');
        done();
      });
    });

    it('requires a title to be unique', function(done) {
      var data = validMovieData();

      movie.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert.equal(res.insertedID, 1);
        assert.equal(res.changed, 1);

        movie.create(data, function(err, res) {
          assert.equal(err.errno, 19);
          assert.equal(err.message, 'SQLITE_CONSTRAINT: UNIQUE constraint failed: movies.title');
          done();
        });
      });
    });

    it('defaults inventory to zero', function(done) {
      var data = validMovieData();
      delete data.inventory;

      movie.create(data, function(err, res) {
        assert.equal(err, undefined);
        assert(res.insertedID, 1);
        movie.findBy('id', res.insertedID, function(err, rows) {
          assert.equal(rows.length, 1);
          assert.equal(rows[0].inventory, 0);
          done();
        });
      });
    });
  });

  describe('#all', function() {
    var numMoviesSeeded;

    beforeEach(function(done) {
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

    it('returns all movies', function(done) {
      movie.all(function(err, rows){
        assert.equal(err, undefined);
        assert.equal(rows.length, numMoviesSeeded);
        done();
      });
    });
  });

  describe('#findBy', function() {
    beforeEach(function(done) {
      var data = {
        movies: [
          // NOTE: we need to maintain these titles (where 'Jaws' is in both)
          //       in order to test that only exact matches are returned
          { title: 'Jaws', overview: 'Shark!', release_date: '1975-06-19', inventory: 10 },
          { title: 'Jaws and Maws', overview: 'Worm!', release_date: '2015-09-12', inventory: 11 },
          { title: 'The French Connection', overview: 'Bonjour!', release_date: '1971-10-07', inventory: 8 }
        ]
      }

      resetTables(data, done);
    });

    // because of how we seeded the db, this also tests that it will only return exact title matches
    it('returns 1 movie where the name is Jaws', function(done) {
      movie.findBy('title', 'Jaws', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].title, 'Jaws');
        done();
      });
    });

    it('"JAWS" returns movie with title "Jaws"', function(done) {
      movie.findBy('title', 'JAWS', function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].title, 'Jaws');
        done();
      });
    });

    it('returns an error when an unrecognized column is provided', function(done) {
      movie.findBy('badColumnName', 'Jaws', function(err, rows) {
        assert(err);
        assert.equal(err.message, 'Error: syntax error. Unrecognized parameter.');
        assert.equal(rows, undefined);
        done();
      });
    });
  });

  describe('#sortBy', function() {
    var numMoviesSeeded;

    beforeEach(function(done) {
      var data = {
        movies: [
          { title: 'Jaws and Maws', overview: 'Worm!', release_date: '1980-01-01', inventory: 11 },
          { title: 'The French Connection', overview: 'Bonjour!', release_date: '1971-10-07', inventory: 8 },
          { title: 'Jaws', overview: 'Shark!', release_date: '1975-06-19', inventory: 10 }
        ]
      }

      numMoviesSeeded = data.movies.length;

      resetTables(data, done);
    });

    it('returns all movies sorted by title', function(done) {
      movie.sortBy('title', null, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numMoviesSeeded);
        assert.equal(rows[0].title, 'Jaws');
        done();
      });
    });

    it('returns all movies sorted by release_date', function(done){
      movie.sortBy('release_date', null, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, numMoviesSeeded);
        assert.equal(rows[0].release_date, '1971-10-07');
        done();
      });
    });

    it('returns 1 movie sorted by title', function(done) {
      movie.sortBy('title', 1, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].title, 'Jaws');
        done();
      });
    });

    it('returns 1 movie sorted by release_date', function(done){
      movie.sortBy('release_date', 1, null, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].release_date, '1971-10-07');
        done();
      });
    });

    it('returns 1 movie sorted by title from the second page', function(done) {
      movie.sortBy('title', 1, 2, function(err, rows) {
        assert.equal(err, undefined);
        assert.equal(rows.length, 1);
        assert.equal(rows[0].title, 'Jaws and Maws');
        done();
      });
    });
  });

  describe('Movie specific functions', function() {
    beforeEach(function(done) {
      var data = {
        movies: [
          { title: 'Jaws', overview: 'Shark!', release_date: '1975-06-19', inventory: 10 },
          { title: 'Jaws and Maws', overview: 'Worm!', release_date: '2015-09-12', inventory: 11 },
          { title: 'The French Connection', overview: 'Bonjour!', release_date: '1971-10-07', inventory: 8 }
        ],
        customers: [
          { name: 'Customer1', registered_at: '2015-01-02', address: 'Address1', city: 'City1', state: 'State1', postal_code: 'Zip1', phone: 'Phone1', account_balance: '1250' },
          { name: 'Customer2', registered_at: '2014-12-01', address: 'Address2', city: 'City2', state: 'State2', postal_code: 'Zip2', phone: 'Phone2', account_balance: '1000' },
        ],
        rentals: [
          { checkout_date: '2015-09-16', return_date: '', movie_title: 'Jaws', customer_id: 1 },
          { checkout_date: '2015-03-16', return_date: '2015-03-20', movie_title: 'Jaws and Maws', customer_id: 1 },
          { checkout_date: '2015-06-23', return_date: '', movie_title: 'Jaws and Maws', customer_id: 2 },
          { checkout_date: '2015-09-18', return_date: '', movie_title: 'The French Connection', customer_id: 2 }
        ]
      }

      resetTables(data, done);
    });

    describe('#customersCurrent', function() {
      it('returns a list of customers who currently have checked out a movie given the title', function(done) {
        movie.customersCurrent('The French Connection', function(err, rows) {
          assert.equal(err, undefined);
          assert.equal(rows.length, 1);
          assert.equal(rows[0].rental_id, 4);
          assert.equal(rows[0].checkout_date, '2015-09-18');
          done();
        });
      });
    });

    describe('#customersPast', function() {
      it('returns a list of customers sorted by customer_id who have checked out a movie in the past given the title', function(done) {
        movie.customersPast('Jaws and Maws', 'customer_id', function(err, rows) {
          assert.equal(err, undefined);
          assert.equal(rows.length, 1);
          assert.equal(rows[0].customer_id, 1);
          done();
        });
      });

      it('returns a list of customers sorted by customer name who have checked out a movie in the past given the title', function(done) {
        movie.customersPast('Jaws and Maws', 'name', function(err, rows) {
          assert.equal(err, undefined);
          assert.equal(rows.length, 1);
          assert.equal(rows[0].name, 'Customer1');
          done();
        });
      });

      it('returns a list of customers sorted by checkout_date who have checked out a movie in the past given the title', function(done) {
        movie.customersPast('Jaws and Maws', 'checkout_date', function(err, rows) {
          assert.equal(err, undefined);
          assert.equal(rows.length, 1);
          assert.equal(rows[0].checkout_date, '2015-03-16');
          done();
        });
      });
    });

    describe('#numAvail', function() {
      it('returns the number of movies available for rent for a given movie', function(done) {
        movie.numAvail('Jaws and Maws', function(err, rows) {
          assert.equal(err, undefined);
          assert.equal(rows.length, 1);
          assert.equal(rows[0].num_available, 10);
          done();
        });
      });
    });
  });
});
