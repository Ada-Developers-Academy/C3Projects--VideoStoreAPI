Movies

🔵 get "/movies" = All movies
 - written method 'find_all'; test passed,
 - displays all movies on webpage

🔵 get "/movies/sort/title/:limit/:page" = sort title alphabetically. We need movie titles.
  * From Movies table:
    - titles

🔵 get "/movies/sort/release_date/:limit/:page" = sort by release_date. We need movie release dates.
  * From Movies table:
    - release_date

🔵 get "/movies/:title/customers/current" = Customers who currently have this movie checked out.
    - From Movies table find movie_id
    - From rentals table find all the same movie_ids
    - if returned_date == nil
    - return customer_id
    - From Customer table find customers with customer_id

🔵 get "/movies/:title/customers/past/sort_by_id" = movie title, sorted by customers ids
  - From Movies Table find movie_id
  - From Rentals table find all the same movie_ids
  - if returned_date != nil
  - return customer_ids
  - From Customers table find customers with customer_id.

🔵 get "/movies/:title/customers/past/sort_by_name" = movie title, sorted by customers names

get "/movies/:title/customers/past/sort_by_checkout_date" = movie title, sorted by checkout dates

🔵 get "/movies/:title" = Search for one specific title. Include synopsis, release date, and inventory total.
 - From Movies table find title

🔵 get "/movies/:title/available" = Returns inventory available to rent.
  - From Movies table find available

Customers
🔵 get "/customers" = All customers
  - √ From Customers table find all customers
  - √ displays all customers on webpage

🔵 get "/customers/sort/name/:limit/:page" = sort customers alphabetically by name.
  - From Customers table find all customers
  - sort by name

🔵 get "/customers/sort/registered_at/:limit/:page" = returns all customers sorted date they registered.

🔵 get "/customers/sort/postal_code/:limit/:page" = returns all customers sorted by postal_code.

get "/customers/:id/movies/current" = show all the movies that this customer is renting currently.
  - From Rentals table find all of one customer's current rentals


get "/customers/:id/movies/past" = show all the movies that this customer has rented in the past, sorted by the checkout date. Include return date in response.
 - From Rentals table find all of one customer's past rentals

Rental

post "/rent/checkout" = Checks out the movie to the customer. Change the available inventory for that specific title. Do we decided how much to charge and when to return the movie?
 * Add to Rentals table:
   - customer_id :integer
   - movie_id :integer
   - checkout_date :string
   - returned_date :string - nill when init
   - rental_time :integer
   - cost_per_day :integer
   - total :integer - nil when init

put "/rent/checkin" = Checks in the movie to the customer. changes the available inventory for that specific title.
 * Update Rentals table:
   - returned_date :string
   - total :integer

🔵 get "/rent/overdue" = All customers with overdue movies. *Added extra feature: returns not just customers with overdue movies, but also overdue days*
 * From Rentals table
  - returned_date
  - checkout_date
  - rental_time
  - if returned_date - checkout_date > rental_time ||
  - if returned_date ==  nil && if Time.now - checkout_date > rental_time
