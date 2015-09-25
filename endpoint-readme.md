Anita & Alice's Video Store
---------------------------

**Endpoints**

See below for the available endpoints for this API.

**Customers**

GET '/customers'

- Returns list of all customers.
- Includes the following properties: name, registered_at (date of registration), address, city, state, postal_code, phone, account_credit (in cents).
- [Sample: GET '/customers'](./samples/get_customers.json)

GET '/customers/:id'

- Returns data about the customer identified by the id passed in the URI.
- Includes customer_data and rentals.
  - customer_data includes the following properties: name, registered_at (date of registration), address, city, state, postal_code, phone, account_credit (in cents).
  - rentals includes: current_rentals and past_rentals.
    - current_rentals and past_rentals are lists of movies rented by the customer.
    - Each movie object includes the following propeties: title, overview, release_date, inventory.
- [Sample: GET '/customers/1'](./samples/get_customers_id.json)

GET '/customers/:sort_by/:limit/:offset'


*Movies*

GET '/movies'

GET '/movies/:title/:order'

GET '/movies/:sort_by/:limit/:offset'

*Rentals*

GET '/rentals/overdue'

GET '/rentals/:title'

POST '/rentals/checkout/:customer_id/:movie_title'

PUT '/rentals/checkin/:customer_id/:movie_title'
