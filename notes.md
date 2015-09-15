Movies
get "/movies" = All movies

get "/movies/sort/title?page=:page&number=:number" = sort title alphabetically. We need movie titles.

get "/movies/sort/release_date?page=:page&number=:number" = sort by release_date. We need movie release dates.

get "/movies/:title/customers/current" =

get "/movies/:title/customers/past/sort_by_id" = movie title, sorted by customers ids

get "/movies/:title/customers/past/sort_by_name" = movie title, sorted by customers names

get "/movies/:title/customers/past/sort_by_checkout_date" = movie title, sorted by checkout dates

get "/movies/:title" = Search for one specific title. Include synopsis, release date, and inventory total.

get "/movies/:title/available" = Returns inventory available to rent.

Customers
get "/customers" = All customers

get "/customers/sort/name?page=:page&number=:number" = sort customers alphabetically by name.

get "/customers/sort/registered_at?page=:page&number=:number" = returns all customers sorted by location.

get "/customers/sort/postal_code?page=:page&number=:number" = returns all customers sorted by postal_code.

get "/customers/:id/movies/current" = show all the movies that this customer is renting currently.

get "/customers/:id/movies/past" = show all the movies that this customer has rented in the past, sorted by the checkout date. Include return date in response.

Rental

get "/rent/:customer_id/:title/checkout" = Checks out the movie to the customer. Change the available inventory for that specific title. Do we decided how much to charge and when to return the movie?

get "/rent/:customer_id/:title/checkin" = Checks in the movie to the customer. changes the available inventory for that specific title.

get "/rent/overdue" = All customers with overdue movies.












