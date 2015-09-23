> ## Endpoints

<!--

seed data:
- movies
- customers

other data:
- transactions
  - __active__: customer rents movie
    - pay when you rent
    - customer's account credit / balance needs to be updated $$$$$
    - there is a return / due date on this transaction
  - __inactive / complete__: customer returns movie
    - record is updated to include a return date

-->

1. Customers
  - GET all customers `http://wobsite.url/customers/all`
    - GET subset of customers, sorted by a passed in attribute
      - name `http://wobsite.url/customers/all?sort=name&page=2`
      - registered_at `http://wobsite.url/customers/all?sort=registered_at&page=2`
      - postal_code `http://wobsite.url/customers/all?sort=postal_code&page=2`
  - GET single customer profile `http://wobsite.url/customers/1`

2. Movies
  - GET all movies `http://wobsite.url/movies/all`
  - GET subset of movies
    - title `http://wobsite.url/movies/all?sort=title&page=2`
    - release_date `http://wobsite.url/movies/all?sort=release_date&page=2`
  - GET single movie profile
  - GET a list of customers who are renting the title `http://wobsite.url/movies/<title>/renting`
    - GET a list of customers that have rented the title
      - customer id `http://wobsite.url/movies/<title>/rented?sort=customer_id&page=2`
      - customer name `http://wobsite.url/movies/<title>/rented?sort=customer_name&page=2`
      - check out date `http://wobsite.url/movies/<title>/rented?sort=check_out_date&page=2`


3. Rentals - this is the interface used when talking to customers
  - GET `http://wobsite.url/rentals/movies/<title>`
    - returns
      - synopsis
      - release date
      - inventory total
      - whether title is available for rent
  - see all customers who currently have a copy `http://wobsite.url/rentals/movies/<title>/customers/all`
  - GET a list of customers with overdue movies
    - `http://wobsite.url/rentals/overdue`
  - POST check out a title `http://wobsite.url/rentals/movies/<title>/customers/:id`
    - create return date
    - create charge customer's account
  - PATCH check in a title `http://wobsite.url/rentals/movies/<title>/customers/:id`
    - update record
      - returned = true
    - update movie's inventory
    - update returned date
