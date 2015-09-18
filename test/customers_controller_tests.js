var assert = require("assert");
var CustomersController = require("../controllers/customers");

describe("CustomersController", function() {
  var cc = null,
      db = null;
  beforeEach(function() {
    db = new Database("db/test.db");
    cc = new CustomerController;
  });

  describe("GET /customers", function() {
    it("returns all customers")
  });

  describe("GET /customers/:id", function() {

  });

  describe("GET /customers/by_name", function() {

  });

  describe("GET /customers/by_registered_at", function() {

  });

  describe("GET /customers/by_postal_code", function() {

  });
});

// THEY ALL SHOULD:
//
// it("returns JSON", function() {
//
// });
//
// it("should return 200 if results", function() {
//
// });
//
// it("should return 204 if no results", function() {
//
// });
