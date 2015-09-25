Movies

http://localhost:3000/movies
🔵 get "/movies" = All movies
 - written method 'find_all'; test passed,
 - displays all movies on webpage

http://localhost:3000/movies/sort/title/5/0
🔵 get "/movies/sort/title/:limit/:page" = sort title alphabetically. We need movie titles.
  * From Movies table:
    - titles

http://localhost:3000/movies/sort/release_date/5/0
🔵 get "/movies/sort/release_date/:limit/:page" = sort by release_date. We need movie release dates.
  * From Movies table:
    - release_date

http://localhost:3000/movies/The%20Silence%20of%20the%20Lambs/customers/current
🔵 get "/movies/:title/customers/current" = Customers who currently have this movie checked out.
    - From Movies table find movie_id
    - From rentals table find all the same movie_ids
    - if returned_date == nil
    - return customer_id
    - From Customer table find customers with customer_id

http://localhost:3000/movies/The%20Exorcist/customers/past/sort_by_id
🔵 get "/movies/:title/customers/past/sort_by_id" = movie title, sorted by customers ids
  - From Movies Table find movie_id
  - From Rentals table find all the same movie_ids
  - if returned_date != nil
  - return customer_ids
  - From Customers table find customers with customer_id.

http://localhost:3000/movies/The%20Exorcist/customers/past/sort_by_name
🔵 get "/movies/:title/customers/past/sort_by_name" = movie title, sorted by customers names

http://localhost:3000/movies/The%20Exorcist/customers/past/sort_by_checkout_date
🔵 get "/movies/:title/customers/past/sort_by_checkout_date" = movie title, sorted by checkout dates

http://localhost:3000/movies/The%20Exorcist
🔵 get "/movies/:title" = Search for one specific title. Include synopsis, release date, and inventory total.
 - From Movies table find title

http://localhost:3000/movies/The%20Exorcist/available
🔵 get "/movies/:title/available" = Returns inventory available to rent.
  - From Movies table find available

Customers
http://localhost:3000/customers
🔵 get "/customers" = All customers
  - √ From Customers table find all customers
  - √ displays all customers on webpage

http://localhost:3000/customers/sort/name/5/0
🔵 get "/customers/sort/name/:limit/:page" = sort customers alphabetically by name.
  - From Customers table find all customers
  - sort by name

FIX
http://localhost:3000/customers/sort/registered_at/5/0
🔵 get "/customers/sort/registered_at/:limit/:page" = returns all customers sorted date they registered.

http://localhost:3000/customers/sort/postal_code/5/0
🔵 get "/customers/sort/postal_code/:limit/:page" = returns all customers sorted by postal_code.

CHECK
get "/customers/:id/movies/current" = show all the movies that this customer is renting currently.
  - From Rentals table find all of one customer's current rentals

http://localhost:3000/customers/1/movies/past
🔵 get "/customers/:id/movies/past" = show all the movies that this customer has rented in the past, sorted by the checkout date. Include return date in response.
 - From Rentals table find all of one customer's past rentals
SELECT title, checkout_date, return_date FROM movies, rentals WHERE rentals.customer_id = 2 AND rentals.returned_date != 'nil' ORDER BY checkout_date DESC;";
Rental

SELECT title, checkout_date, returned_date FROM movies, rentals where movies.id = rentals.movie_id and rentals.returned_date != 'nil' and rentals.customer_id = 4 ORDER BY checkout_date DESC;

post "/rent/checkout" = Checks out the movie to the customer. Change the available inventory for that specific title. Do we decided how much to charge and when to return the movie?
 * Add to Rentals table:
   - customer_id :integer
   - movie_id :integer
   - checkout_date :string
   - returned_date :string - nill when init
   - rental_time :integer
   - cost_per_day :integer
   - total :integer - nil when init

CURL ===============================
curl -X PUT -d '{"customer_id":"4", "movie_id":"5", "total": "5", "returned_date": "09-24-2015"}' -H 'contentype:application/json' "http://localhost:3000/rent/checkin"
=====================================
DB=development node ./utils/schema.js
DB=development node ./utils/seed.js
sqlite3 db/development.db

🔵 put "/rent/checkin" = Checks in the movie to the customer. changes the available inventory for that specific title.
 * Update Rentals table:
   - returned_date :string
   - total :integer
 * Update Customers table;  
   - account_credit
 * Update Movies table:
  - inventory
  - available

http://localhost:3000/rent/overdue
🔵 get "/rent/overdue" = All customers with overdue movies. *Added extra feature: returns not just customers with overdue movies, but also overdue days*
 * From Rentals table
  - returned_date
  - checkout_date
  - rental_time
  - if returned_date - checkout_date > rental_time ||
  - if returned_date ==  nil && if Time.now - checkout_date > rental_time

*Added a new extra endpoint - rent history*
http://localhost:3000/rent
🔵 get  "/rent" - all rental history
