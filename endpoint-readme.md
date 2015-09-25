Anita & Alice's Video Store
---------------------------

**Endpoints**

See below for the available endpoints for this API.

*Customers*

*GET '/customers'*

GET '/customers/:id'

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
