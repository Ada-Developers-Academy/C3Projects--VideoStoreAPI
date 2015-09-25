// test CustomersController here

// dependencies supertest
var request = require("supertest");
var app     = require("../../app");
var agent   = request.agent(app); // supertest magic

// dependencies other test mechanisms
var assert  = require("assert");
var sqlite3 = require("sqlite3").verbose();

describe("CustomersController", function() {
//---------------------------------------------------------------------------------------------------------------------
//--------- GET /all --------------------------------------------------------------------------------------------------
  describe("GET `/all`", function() {
    var thisUrl = "/customers/all";
    var uniqueThisEndpoint = "all";

    it("responds 200 && returns a JSON object", function(done) {
      agent
        .get(thisUrl)
        .set("Accept", "application/json")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    })

    describe("the returned JSON object", function() {
      describe("meta data", function() {
        it("includes `yourQuery` -- a URL for the current endpoint & query", function(done) {
          agent
            .get(thisUrl)
            .expect(200, function(error, result) {
              assert(result.body.meta.yourQuery);
              assert(result.body.meta.yourQuery.indexOf(uniqueThisEndpoint) > 0);
              done();
            })
        })

        it("includes `totalResults`", function(done) {
          agent
            .get(thisUrl)
            .expect(200, function(error, result) {
              assert(result.body.meta.totalResults);
              assert.equal(result.body.meta.totalResults, 200);
              done();
            })
        })

        describe("pagination", function() {
          it("includes `prevPage` when relevant", function(done) {
            var page = 2;
            var pageUrl = thisUrl + "/" + page;
            var uniqueThisEndpoint = page - 1;

            agent
              .get(pageUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.yourQuery);
                assert(result.body.meta.yourQuery.indexOf(page) > 0);
                done();
              })
          })

          it("doesn't include `prevPage` when it's not relevant", function(done) {
            var page = 1;
            var pageUrl = thisUrl + "/" + page;

            agent
              .get(pageUrl)
              .expect(200, function(error, result) {
                assert(!result.body.meta.prevPage);
                done();
              })
          })

          it("includes `nextPage` when relevant", function(done) {
            var page = 1;
            var pageUrl = thisUrl + "/" + page;
            var uniqueThisEndpoint = page + 1;

            agent
              .get(pageUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.nextPage);
                assert(result.body.meta.nextPage.indexOf(uniqueThisEndpoint) > 0);
                done();
              })
          })

          it("doesn't include `nextPage` when it's not relevant", function(done) {
            var page = 20;
            var pageUrl = thisUrl + "/" + page;

            agent
              .get(pageUrl)
              .expect(200, function(error, result) {
                assert(!result.body.meta.nextPage);
                done();
              })
          })
        }) // pagination
      }) // outer meta data

      describe("data", function() {
        it("returns no more than 10 customers", function(done) {
          agent
            .get(thisUrl)
            .expect(200, function(error, result) {
              var data = result.body.data;
              var customers = data.customers;
              assert(customers.length <= 10);
              done();
            })
        })

        describe("each customer contains relevant customer info", function() {
          agent
            .get(thisUrl)
            .expect(200, function(error, result) {
              var customer = result.body.data.customers[0];

              describe("meta data", function() {
                it("`moreCustomerInfo`", function(done) {
                  assert(customer.meta.moreCustomerInfo);
                  assert(customer.meta.moreCustomerInfo.indexOf(customer.data.id) > 0);
                  done();
                })
              }) // each cu. meta data

              describe("`data`", function() {
                it("contains relevant customer info", function(done) {
                  var customerKeys = ["id", "name", "registered_at", "postal_code"];
                  customerKeys.forEach(function(key, index) {
                    assert(customer.data[key]);

                    if (index == customerKeys.length - 1)
                      done();
                  }) // customerKeys forEach
                }) // relevant co. info
              }) // each cu. data
          }) // expect
        }) // describe each cu.
      }) // describe data
    }) // returned JSON object
  }) // GET /all

//---------------------------------------------------------------------------------------------------------------------
//--------- GET /all/:sort_by -----------------------------------------------------------------------------------------
  describe("GET `/all/:sort_by`", function() {
    var thisUrl = "/customers/all/sort_by=";
    var sorts = ["registered_at", "name", "postal_code"];

    sorts.forEach(function(sort) {
      var sortUrl = thisUrl + sort;
      var uniqueThisEndpoint = sort;

      it("responds 200 && returns a JSON object", function(done) {
        agent
          .get(sortUrl)
          .set("Accept", "application/json")
          .expect("Content-Type", /application\/json/)
          .expect(200, done);
      })

      describe("the returned JSON object", function() {
        describe("meta data", function() {
          it("includes `yourQuery` -- a URL for the current endpoint & query", function(done) {
            agent
              .get(sortUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.yourQuery);
                assert(result.body.meta.yourQuery.indexOf(uniqueThisEndpoint) > 0);
                done();
              })
          })

          it("includes `totalResults`", function(done) {
            agent
              .get(sortUrl)
              .expect(200, function(error, result) {
                assert(result.body.meta.totalResults);
                assert.equal(result.body.meta.totalResults, 200);
                done();
              })
          })

          describe("pagination", function() {
            it("includes `prevPage` when relevant", function(done) {
              var page = 2;
              var pageUrl = sortUrl + "/" + page;
              var uniqueThisEndpoint = page - 1;

              agent
                .get(pageUrl)
                .expect(200, function(error, result) {
                  assert(result.body.meta.yourQuery);
                  assert(result.body.meta.yourQuery.indexOf(page) > 0);
                  done();
                })
            })

            it("doesn't include `prevPage` when it's not relevant", function(done) {
              var page = 1;
              var pageUrl = sortUrl + "/" + page;

              agent
                .get(pageUrl)
                .expect(200, function(error, result) {
                  assert(!result.body.meta.prevPage);
                  done();
                })
            })

            it("includes `nextPage` when relevant", function(done) {
              var page = 1;
              var pageUrl = sortUrl + "/" + page;
              var uniqueThisEndpoint = page + 1;

              agent
                .get(pageUrl)
                .expect(200, function(error, result) {
                  assert(result.body.meta.nextPage);
                  assert(result.body.meta.nextPage.indexOf(uniqueThisEndpoint) > 0);
                  done();
                })
            })

            it("doesn't include `nextPage` when it's not relevant", function(done) {
              var page = 20;
              var pageUrl = sortUrl + "/" + page;

              agent
                .get(pageUrl)
                .expect(200, function(error, result) {
                  assert(!result.body.meta.nextPage);
                  done();
                })
            })
          }) // pages
        }) // outer meta data

        describe("data", function() {
          it("returns no more than 10 customers", function(done) {
            agent
              .get(sortUrl)
              .expect(200, function(error, result) {
                var data = result.body.data;
                var customers = data.customers;
                assert(customers.length <= 10);
                done();
              })
          })

          it("returns an array of customer info sorted by " + sort, function(done) {
            agent
              .get(sortUrl)
              .expect(200, function(error, result) {
                var data = result.body.data;
                var customers = data.customers;
                assert(customers[0].data[sort] < customers[1].data[sort]);
                done();
              })
          })

          describe("each customer contains relevant customer info", function() {
            agent
              .get(sortUrl)
              .expect(200, function(error, result) {
                var customer = result.body.data.customers[0];

                describe("meta data", function() {
                  it("`moreCustomerInfo`", function(done) {
                    assert(customer.meta.moreCustomerInfo);
                    assert(customer.meta.moreCustomerInfo.indexOf(customer.data.id) > 0);
                    done();
                  })
                })

                describe("`data`", function() {
                  it("contains relevant customer info", function(done) {
                    var customerKeys = ["id", "name", "registered_at", "postal_code"];
                    customerKeys.forEach(function(key, index) {
                      assert(customer.data[key]);

                      if (index == customerKeys.length - 1)
                        done();
                    })
                  })
                }) // bye, describe `data`
            }) // agent.expect, there should be a gap in braces between this line & above!
          }) // each cu. relevant
        }) // outer data
      })
    })
  })

//---------------------------------------------------------------------------------------------------------------------
//--------- GET /:id --------------------------------------------------------------------------------------------------
  describe("GET `/:id`", function() {
    var id = 1;
    var thisUrl = "/customers/" + id;
    var uniqueThisEndpoint = id;

    it("responds 200 && returns a JSON object", function(done) {
      agent
        .get(thisUrl)
        .set("Accept", "application/json")
        .expect("Content-Type", /application\/json/)
        .expect(200, done);
    })

    describe("the returned JSON object", function() {
      describe("meta data", function() {
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

      describe("data", function() {

      })
    })
  })
})
