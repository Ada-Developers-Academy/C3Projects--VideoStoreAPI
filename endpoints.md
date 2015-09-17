VIDEO STORE PROJECT ROUTES *****************

   CUSTOMER

  GET '/customers'
   returns all of the customers
    all of the attr of customers

  GET '/customers&order_by="name"'
   returns n number of customers (hardcoded?) sorted by name
   offset by p records (hardcoded)
    all of the attr of customers

  GET '/customers&order_by="registered_at"'
   returns n number of customers (hardcoded?) sorted by registered_at
   offset by p records (hardcoded)
    all of the attr of customers

  GET '/customers&order_by="postal_code"'
   returns n number of customers (hardcoded?) sorted by postal_code
   offset by p records (hardcoded)
    all of the attr of customers

  GET '/customers/:id'
    all of the attr of that customer

     currently checked out movies
       all movies with that customer_id and return_date == nil
         include id, title

     movies checked out in the past
       all movies with that customer_id and return_date != nil (sort ASC by checkout_date)
         include id, title and return_date

   MOVIES

  GET '/movies'
   returns all of the movies
    all of the attr of movies

  GET '/movies&order_by="title"'
   returns n number of movies (hardcoded?) sorted by title
   offset by p records (hardcoded)

  GET '/movies&order_by="release_date"'
   returns n number of movies (hardcoded?) sorted by release_date
   offset by p records (hardcoded)

  GET '/movies/:title'  returns movies that match the title query
     returns movie synopsis, release_date, inventory_total, inventory_avail

  GET '/movies/:title/customers'  default is sorting by id
  GET '/movies/:title/customers&order_by="name"'
  GET '/movies/:title/customers&order_by="checkout_date"'
    { current_customers: 
      [ customer1 : { name: blah, ... },
        customer2: { etc } ],  customers CURRENTLY checked out this movie

      previous_customers:
      [customers PREVIOUSLY who checked out this movie]
    }

   RENTALS-- Checkout *******

  POST '/customers/:id/rental/:title'
     maybe change it be searching for movie id instead of movie title?

     creates new rental entry
       customer_id, movie_id, checkout_date, due_date of +7 days later, return_date == nil
     on success...

      PUT   updates inventory_avail -1 for that movie
            updates customer account_credit -$X rental fee

   RENTALS-- Checkin *******

  PUT '/customers/:id/rental/:title'
     updates return_date to Time.now (rental record)
     updates inventory_avail +1 for that movie

  GET '/rentals/overdue'
     array of customers with all their overdue movies
       overdue = current_date > due_date && return_date == nil

    { customers: [
      { name1 : "something",
        overdue_movies: [
          { title1 : "",
            release_date : dateTime,
          },
          { title2 : "",
            release_date : dateTime,
          }
        ]
      },
      
      { name2 : "something",
        overdue_movies: [
          { title1 : "",
            release_date : dateTime,
          },
          { title2 : "",
            release_date : dateTime,
          }
        ]
      },
      ]
    }


 **************************