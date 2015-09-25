- - -
> ## Endpoints
- - -

For all paginated results, the page number is optional. By default, the first page is returned.

## 1. Customers
  - GET all customers  
    `http://wobsite.url/customers/all/:page`
  - GET all customers, sorted by a passed in attribute  
    `http://wobsite.url/customers/all/sort_by=:sort/:page`
    - name  
      `http://wobsite.url/customers/all/sort_by=name/2`
    - registered_at  
      `http://wobsite.url/customers/all/sort_by=registered_at/2`
    - postal_code  
      `http://wobsite.url/customers/all/sort_by=postal_code/2`
  - GET single customer profile  
    `http://wobsite.url/customers/1`

## 2. Movies
  - GET all movies  
    `http://wobsite.url/movies/all`
  - GET all movies, sorted by a passed in attribute  
    `http://wobsite.url/movies/<title>/all/sort_by=:sort/:page`
    - title  
      `http://wobsite.url/movies/all/sort_by=title/2`
    - release_date  
      `http://wobsite.url/movies/all/sort_by=release_date/2`
  - GET single movie profile  
    `http://wobsite.url/movies/<title>`
  - GET a list of customers who are renting the title  
    `http://wobsite.url/movies/<title>/renting`
  - GET a list of customers that have rented the title, sorted by a passed in
    attribute  
   `http://wobsite.url/movies/<title>/rented/sort_by=:sort/:page`
    - customer id  
      `http://wobsite.url/movies/<title>/rented/sort_by=customer_id/2`
    - customer name  
      `http://wobsite.url/movies/<title>/rented/sort_by=customer_name/2`
    - check out date  
      `http://wobsite.url/movies/<title>/rented/sort_by=check_out_date/2`


## 3. Rentals
  - GET Rentals Edition™ single movie profile  
    `http://wobsite.url/rentals/movies/<title>`
  - GET a list of all customers who currently have a copy of a given title  
    `http://wobsite.url/rentals/movies/<title>/customers`
  - GET a list of customers with overdue movies  
    `http://wobsite.url/rentals/overdue`
  - POST without request body to check out a title  
    `http://wobsite.url/rentals/movies/<title>/customers/:id`
    - example request:
      `curl -X POST http://wobsite.url/rentals/Alien/customers/100`
    - returns a receipt
  - PATCH without request body to return a title  
    `http://wobsite.url/rentals/movies/<title>/customers/:id`
    - example request:  
      `curl --request PATCH http://wobsite.url/rentals/Alien/customers/100`
    - returns a receipt
