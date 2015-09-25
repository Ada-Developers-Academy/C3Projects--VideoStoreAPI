Anita & Alice's Video Store
---------------------------

**Endpoints**

See below for the available endpoints for this API.

**Customers**

GET '/customers'

- Retrieves a list of all customers.
- Returns an object with a `customers` property containing an array of customer objects.
- Each customer object contains the following properties: `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
- [Sample: GET '/customers'](./samples/get_customers.json)

GET '/customers/:id'

- Retrieves data about the customer identified by the id passed in the URL.
- Returns an object with `customer_data` and `movies` properties.
  - `customer_data` contains the following properties: `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
  - `movies` contains: `current_rentals` and `past_rentals`.
    - `current_rentals` is a list of movies rented by the customer.
      - Each movie object contains the following propeties: `title`, `overview`, `release_date`, and `inventory`.
    - `past_rentals` is a list of movie objects.
      - Each movie object contains `movie_data` and `dates`.
        - `dates` contains `checkout_date` and `returned_date`.
        - `movie_data` contains: `title`, `overview`, `release_date`, and `inventory`.
- [Sample: GET '/customers/1'](./samples/get_customers_id.json)

GET '/customers/:sort_by/:limit/:offset'

- Sorts the entire set of customers by a certain property (`sort_by`), then retrieves a number (`limit`) of customers, starting at a certain index (`offset`).
  - `sort_by` accepts 'name' (customer name), 'id' (customer id), or 'checkout_date'.
  - `limit` must be an integer >= 0.
  - `offset` must be an integer >= 0.
- Returns an object with a `customers` property containing an array of customer objects.
- Each customer object contains the following properties: `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
- [Sample: GET '/customers/name/2/2'](./samples/get_customers_sort_by_limit_offset.json)

*Movies*

GET '/movies'

GET '/movies/:title/:order'

GET '/movies/:sort_by/:limit/:offset'

*Rentals*

GET '/rentals/overdue'

GET '/rentals/:title'

POST '/rentals/checkout/:customer_id/:movie_title'

PUT '/rentals/checkin/:customer_id/:movie_title'
