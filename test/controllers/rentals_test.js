"use strict";

var request = require('supertest');
var assert = require('assert');
var app = require('../../app');
var agent = request.agent(app);
// var sqlite3 = require('sqlite3').verbose(); // currently unused

var resetTables = require('../dbCleaner');

describe('/rentals', function() {
  describe("POST '/'", function() {
  });
});
