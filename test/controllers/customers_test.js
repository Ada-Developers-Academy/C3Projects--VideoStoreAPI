"use strict";

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var agent = request.agent(app);
// var sqlite3 = require('sqlite3').verbose(); // currently unused

describe.only('/customers', function() {
  describe("GET '/'", function() {
    it("responds with json", function(done) {
      agent.get('/customers').set('Accept', 'application/json')
        .expect('Content-Type', /application\/json/)
        .expect(200, done);
    });
  });
});
