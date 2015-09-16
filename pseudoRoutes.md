##Customers

GET '/customers'
- returns an object of all customer objects
- no data provided


GET '/customers/:sort_by/:number/:offset'
(GET '/customers?sort_by=:column&number=:number&offset=:offset')

- returns select collection of customer objects
- how to tell route to stop at the & ??
- columns are: name, registered_at, postal_code
- number is # of customer records to be returned
- offset is how far into the total records you want to start grabbing records
  - can be used for pagination
- need to provide column name, number, and offset

GET '/customers/:id'
- returns an object for that customer, which has two objects: current and past
  - each of current and past contain a collection of movie objects
  - see resources card on Trello for image of architecture
- need to provide: customer id

##Movies

GET '/movies'
- returns an object of all movie objects

GET '/movies/:sort_by/:number/:offset'
- returns select collection of movie objects
- columns are: title, release_date
