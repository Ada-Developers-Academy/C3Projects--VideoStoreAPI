// dependencies supertest
var request = require("supertest");
var app     = require("../../app");
var agent   = request.agent(app); // supertest magic

// dependencies other test mechanisms
var assert  = require("assert");
var sqlite3 = require("sqlite3").verbose();

describe("RentalsController", function() {
//---------------------------------------------------------------------------------------------------------------------
//--------- GET /:title -----------------------------------------------------------------------------------------------
  describe("GET `/:title`", function() {
    describe("requests with exact title matches", function() {
      var title = "Alien";
      var thisUrl = "/rentals/" + title;

      it("responds 200 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(200, done);
      })

      describe("the returned JSON object", function() {
        describe("data", function() {
          it("includes `movie` -- about the movie", function(done) {
            var movieKeys = ["title", "overview", "release_date", "inventory"].sort();
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.data.movie);
                assert.deepEqual(Object.keys(result.body.data.movie).sort(), movieKeys);
                done();
              })
          })

          it("includes `availableToRent` -- a boolean field", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert.equal(typeof result.body.data.availableToRent, "boolean");
                done();
              })
          })
        })

        describe("meta data", function() {
          it("includes `moreMovieInfo`-- a URL that might provide better results", function(done) {
             agent
               .get(thisUrl)
               .expect(200, function(error, result) {
                 assert(result.body.meta.moreMovieInfo);
                 assert(result.body.meta.moreMovieInfo.indexOf(title) > 0);
                 done();
               })
          })

          it("includes `yourQuery` -- a URL for the current endpoint & query", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.yourQuery);
                assert(result.body.meta.yourQuery.indexOf(title) > 0);
                done();
              })
          })

          it("includes `customersHoldingCopies` endpoint URL with current title plugged in", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.customersHoldingCopies);
                assert(result.body.meta.customersHoldingCopies.indexOf(title) > 0);
                done();
              })
          })
        })
      })
    })


    describe("requests with no exact title matches", function() {
      var thisUrl = "/rentals/men";

      it("responds 303 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(303, done);
      })

      describe("the returned JSON object", function() {
        it("contains a message explaining where & how to look for results", function(done) {
           var message = "No results found. You must query this endpoint with an exact title.";
           agent
             .get(thisUrl)
             .expect(303, function(error, result) { // this is just the supertest way
               assert.equal(result.body.meta.message, message);
               done();
             })
        })

        it("has meta data including `moreMovieInfo`-- a URL that might provide better results", function(done) {
           agent
             .get(thisUrl)
             .expect(303, function(error, result) {
               assert(result.body.meta.moreMovieInfo);
               done();
             })
        })

        it("has meta data including `yourQuery` -- a URL for the current endpoint & query", function(done) {
          agent
            .get(thisUrl)
            .expect(303, function(error, result) {
              assert(result.body.meta.yourQuery);
              done();
            })
        })
      })
    })

    describe("requests with attempted SQL injection in title params", function() {
      var thisUrl = "/rentals/anything;select * from movies;";

      it("responds 400 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(400, done);
      })

      describe("the returned JSON object", function() {
        it("contains a message explaining why the request was bad", function(done) {
          var message = "Request was malformed.";
          agent
            .get(thisUrl)
            .expect(400, function(error, result) {
              assert.equal(result.body.message, message);
              done();
            })
        })
      })
    })
  })

//---------------------------------------------------------------------------------------------------------------------
//--------- GET /:title/customers -------------------------------------------------------------------------------------
  describe("GET `/:title/customers`", function() {
    describe("requests with exact title matches", function() {
      var uniqueThisEndpoint = "customers";
      var title = "Alien";
      var thisUrl = "/rentals/" + title + "/customers";

      it("responds 200 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(200, done);
      })

      describe("the returned JSON object", function() {
        describe("data", function() {
          it("includes `customers`-- an array of customers holding copies of this title", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.data.customers);
                assert(Array.isArray(result.body.data.customers));
                done();
              })
          })

          describe("the customers", function() {
            it("`data` contains the relevant info about the customer", function(done) {
              var customerKeys = ["id", "name", "city", "state", "postal_code", "check_out_date"].sort();
              agent
                .get(thisUrl)
                .expect(200, function(error, result) {
                  var customer = result.body.data.customers[0];
                  assert(customer.data);
                  assert.deepEqual(Object.keys(customer.data).sort(), customerKeys);
                  done();
                })
            })

            it("`meta` data includes `moreCustomerInfo` endpoint URL", function(done) {
              // "moreCustomerInfo": "http://localhost:3000/customers/61"
              agent
                .get(thisUrl)
                .expect(200, function(error, result) {
                  var customer = result.body.data.customers[0];
                  assert(customer.meta);
                  assert(customer.meta.moreCustomerInfo);
                  assert(customer.meta.moreCustomerInfo.indexOf(customer.data.id) > 0);
                  done();
                })
            })
          })
        })

        describe("meta data", function() {
          it("includes `moreRentalInfo` endpoint URL", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.moreRentalInfo);
                assert(result.body.meta.moreRentalInfo.indexOf(title) > 0);
                done();
              })
          })

          it("includes `moreMovieInfo`-- a URL that might provide better results", function(done) {
             agent
               .get(thisUrl)
               .expect(200, function(error, result) {
                 assert(result.body.meta.moreMovieInfo);
                 assert(result.body.meta.moreMovieInfo.indexOf(title) > 0);
                 done();
               })
          })

          it("includes `yourQuery` -- a URL for the current endpoint & query", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.yourQuery);
                assert(result.body.meta.yourQuery.indexOf(title) > 0);
                assert(result.body.meta.yourQuery.indexOf(uniqueThisEndpoint) > 0);
                done();
              })
          })
        })
      })
    })


    describe("requests with no exact title matches", function() {
      var uniqueThisEndpoint = "customers";
      var title = "men";
      var thisUrl = "/rentals/" + title + "/" + uniqueThisEndpoint;

      it("responds 303 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(303, done);
      })

      describe("the returned JSON object", function() {
        it("contains a message explaining where & how to look for results", function(done) {
           var message = "No results found. You must query this endpoint with an exact title. "
                       + "If you are using an exact title, no customers have a copy checked out.";
           agent
             .get(thisUrl)
             .expect(303, function(error, result) { // this is just the supertest way
               assert.equal(result.body.meta.message, message);
               done();
             })
        })

        it("has meta data including `moreMovieInfo`-- a URL that might provide better results", function(done) {
           agent
             .get(thisUrl)
             .expect(303, function(error, result) {
               assert(result.body.meta.moreMovieInfo);
               assert(result.body.meta.moreMovieInfo.indexOf(title) > 0);
               done();
             })
        })

        it("has meta data including `yourQuery` -- a URL for the current endpoint & query", function(done) {
          agent
            .get(thisUrl)
            .expect(303, function(error, result) {
              assert(result.body.meta.yourQuery);
              assert(result.body.meta.yourQuery.indexOf(title) > 0);
              assert(result.body.meta.yourQuery.indexOf(uniqueThisEndpoint) > 0);
              done();
            })
        })
      })
    })

    describe("requests with attempted SQL injection in title params", function() {
      var thisUrl = "/rentals/anything;select * from movies;/customers";

      it("responds 400 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(400, done);
      })

      describe("the returned JSON object", function() {
        it("contains a message explaining why the request was bad", function(done) {
          var message = "Request was malformed.";
          agent
            .get(thisUrl)
            .expect(400, function(error, result) {
              assert.equal(result.body.message, message);
              done();
            })
        })
      })
    })
  })

//---------------------------------------------------------------------------------------------------------------------
//--------- GET /overdue ----------------------------------------------------------------------------------------------
  describe("GET `/overdue`", function() {
    describe("requests with exact title matches", function() {
      var uniqueThisEndpoint = "overdue";
      var thisUrl = "/rentals/" + uniqueThisEndpoint;

      it("responds 200 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(200, done);
      })

      describe("the returned JSON object", function() {
        describe("data", function() {
          it("includes `customers`-- an array of customers holding copies of this title", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.data.customers);
                assert(Array.isArray(result.body.data.customers));
                done();
              })
          })

          describe("the customers", function() {
            it("`data` contains the relevant info about the customer", function(done) {
              var customerKeys = ["id", "name", "city", "state", "postal_code", "check_out_date", "movie_title"].sort();

              agent
                .get(thisUrl)
                .expect(200, function(error, result) {
                  var customer = result.body.data.customers[0];
                  assert(customer.data);
                  assert.deepEqual(Object.keys(customer.data).sort(), customerKeys);
                  done();
                })
            })

            describe("meta data", function () {
              it("includes `moreCustomerInfo` endpoint URL", function(done) {
                agent
                  .get(thisUrl)
                  .expect(200, function(error, result) {
                    var customer = result.body.data.customers[0];
                    assert(customer.meta.moreCustomerInfo);
                    assert(customer.meta.moreCustomerInfo.indexOf(customer.data.id) > 0);
                    done();
                  })
              })

              it("includes `moreRentalInfo` endpoint URL", function(done) {
                agent
                  .get(thisUrl)
                  .expect(200, function(error, result) {
                    var customer = result.body.data.customers[0];
                    assert(customer.meta.moreRentalInfo);
                    assert(customer.meta.moreRentalInfo.indexOf(customer.data.movie_title) > 0);
                    done();
                  })
              })

              it("includes `moreMovieInfo` endpoint URL", function(done) {
                agent
                  .get(thisUrl)
                  .expect(200, function(error, result) {
                    var customer = result.body.data.customers[0];
                    assert(customer.meta.moreMovieInfo);
                    assert(customer.meta.moreMovieInfo.indexOf(customer.data.movie_title) > 0);
                    done();
                  })
              })
            })
            it("`meta` data includes `moreCustomerInfo` endpoint URL", function(done) {
              agent
                .get(thisUrl)
                .expect(200, function(error, result) {
                  var customer = result.body.data.customers[0];
                  assert(customer.meta);
                  assert(customer.meta.moreCustomerInfo);
                  assert(customer.meta.moreCustomerInfo.indexOf(customer.data.id) > 0);
                  done();
                })
            })
          })
        })

        describe("meta data", function() {
          it("includes `nextPage`", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.nextPage);
                assert(result.body.meta.nextPage.indexOf(uniqueThisEndpoint) > 0);
                done();
              })
          })

          it("includes `prevPage` if there is one", function(done) {
            agent
              .get(thisUrl + "/2")
              .expect(200, function(error, result) {
                assert(result.body.meta.prevPage);
                assert(result.body.meta.prevPage.indexOf(uniqueThisEndpoint) > 0);
                done();
              })
          })

          it("doesn't include `prevPage` if there isn't one", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(!result.body.meta.prevPage);
                done();
              })
          })

          it("includes `yourQuery` -- a URL for the current endpoint & query", function(done) {
            agent
              .get(thisUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.yourQuery);
                assert(result.body.meta.yourQuery.indexOf(uniqueThisEndpoint) > 0);
                done();
              })
          })
        })
      })
    })


    describe("requests with no exact title matches", function() {
      var uniqueThisEndpoint = "customers";
      var title = "men";
      var thisUrl = "/rentals/" + title + "/" + uniqueThisEndpoint;

      it("responds 303 && returns a JSON object", function(done) {
        agent
          .get(thisUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(303, done);
      })

      describe("the returned JSON object", function() {
        it("contains a message explaining where & how to look for results", function(done) {
           var message = "No results found. You must query this endpoint with an exact title. "
                       + "If you are using an exact title, no customers have a copy checked out.";
           agent
             .get(thisUrl)
             .expect(303, function(error, result) { // this is just the supertest way
               assert.equal(result.body.meta.message, message);
               done();
             })
        })

        it("has meta data including `moreMovieInfo`-- a URL that might provide better results", function(done) {
           agent
             .get(thisUrl)
             .expect(303, function(error, result) {
               assert(result.body.meta.moreMovieInfo);
               assert(result.body.meta.moreMovieInfo.indexOf(title) > 0);
               done();
             })
        })

        it("has meta data including `yourQuery` -- a URL for the current endpoint & query", function(done) {
          agent
            .get(thisUrl)
            .expect(303, function(error, result) {
              assert(result.body.meta.yourQuery);
              assert(result.body.meta.yourQuery.indexOf(uniqueThisEndpoint) > 0);
              done();
            })
        })
      })
    })
  })
})
