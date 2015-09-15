Customers

GET '/customers'
- returns list of all customers
- no data provided


GET '/customers?sort_by=:column&number=:number&offset=:offset'
- how to tell route to stop at the & ??
- columns are: name, registered_at, postal_code
- number is # of customer records to be returned
- offset is how far into the total records you want to start grabbing records
  - can be used for pagination
- need to provide column name, number, and offset

GET '/customers/:id'
- returns customer object, which has two objects: current and past
- need to provide: customer id

