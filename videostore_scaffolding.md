### Customers
- Retrieve a list of all customers
GET /customers

-Retrive a subset of customers
Given a sort column, return n customer records, offset by p records (this will be used to create "pages" of customers)
GET /customers/:column/:p

-Given a customer's id...
GET /customers/:id

-List the movies they currently have checked out
GET /customers/:id/movies

-List the movies a customer has checked out in the past
Get /customers/:id/history

### Movies
- Retrieve a list of all movies
GET /movies

- Retrieve a subset of movies
- Given a sort column, return _n_ movie records, offset by _p_ records (this will be used to create "pages" of movies)
GET /movies/:column/:p

- Get a list of customers that have _currently_ checked out a copy of the film
GET /movies/:title/customers

  - Get a list of customers that have checked out a copy _in the past_
GET /movies/:title/history

### Rental
- Look a movie up by title to see
GET /movies/:title

- Know if a movie has any inventory available to rent
GET /movies/:title/:checked_out

- See a list of customers that have _currently_ checked out any of the movie's inventory
`This is identical to the requirements under movie`
GET /movies/:title

- Given a customer's `id` and a movie's `title` ...
  - "check out" one of the movie's inventory to the customer
  POST /customers/:id/:title

  - "check in" one of customer's rentals
  PATCH /customers/:id/:title

- See a list of customers with overdue movies
GET /customers/overdue
