Customers
---------

### GET '/customers'
- returns an object of all customer objects
- no data provided


### GET '/customers/:sort_by/:number/:offset'
(GET '/customers?sort_by=:column&number=:number&offset=:offset')

- returns select collection of customer objects
- how to tell route to stop at the & ??
- columns are: name, registered_at, postal_code
- number is # of customer records to be returned
- offset is how far into the total records you want to start grabbing records
  - can be used for pagination
- need to provide column name, number, and offset

### GET '/customers/:id'
- returns an object for that customer, which has two objects: current and past
  - each of current and past contain a collection of movie objects
  - see resources card on Trello for image of architecture
- need to provide: customer id


Movies
------
### GET '/movies'
- returns an object of all movie objects

### GET '/movies/:sort_by/:number/:offset'
- returns select collection of movie objects
- columns are: title, release_date

### GET '/movies/:title/:order'
- customer id: /movies/jaws&id=4
- customer name: /movies/jaws&name=alice
- checkout date: /movies/jaws&date=20150922 (YYYYMMDD)
- returns an object for that movie, has two objects inside: current and past
  - current contains a list of customers that have checked out the film
  - past contains customers that have previously checked out the film
  - :order - allows sorting by: customer id, customer name, or checkout date

Rental
------

### GET '/rental/:title'
- returns a movie object based on title with synopsis, release date, and inventory
  - info on availability: boolean
  - object with list of customers that currently have that movie checked out

### POST '/rental/checkout/:customer_id/:movie_id' (checkout)
- creates a record of rental movie object

### PUT '/rental/checkin/:customer_id/:movie_id' (checkin)
- updates rental record, returned: to true


```javascript
var movies = [
  ['title', 'text'],
  ['overview', 'text'],
  ['release_date', 'text'],
  ['inventory', 'integer']
]

var customers = [
  ['name', 'text'],
  ['registered_at', 'text'],
  ['address', 'text'],
  ['city', 'text'],
  ['state', 'text'],
  ['postal_code', 'text'],
  ['phone', 'text'],
  ['account_credit', 'integer'] // multiplied by 100 to be stored as cents
]

var rentals = [
  ['customer_id', 'integer'],
  ['movie_id', 'integer'],
  ['checkout_date', 'text'],
  ['return_date', 'text'],
  ['returned', 'text'] // boolean
]
```

