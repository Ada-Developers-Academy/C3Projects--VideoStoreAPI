// dependencies supertest
var request = require("supertest");
var app     = require("../../app");
var agent   = request.agent(app); // supertest magic

// dependencies other test mechanisms
var assert  = require("assert");
var sqlite3 = require("sqlite3").verbose();

describe("RentalsController", function () {
  describe("GET `/`", function() {
    it("responds with JSON", function() {
      
    })
  })
})
