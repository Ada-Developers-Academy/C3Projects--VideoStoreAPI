# Project: VideoStoreAPI Kyna and Elia

The overall goal of this project is to create a system that a video store (remember those?) could use to track their inventory of rental videos and their collection of customers.

We will use [NodeJS](https://nodejs.org/en/) to construct a RESTful API. The goal of this API is to quickly serve information about the store's video collection, customer information, and to update rental status. This repository provides two JSON datafiles to serve as the initial seeds for this system.

`movies.json` contains information about the videos available to rent at the store. The data is presented as an array of objects, with each object having the following key-value pairs:

- `title`: The title of the film
- `overview`: A short plot synopsis
- `release_date`: When the film was originally released
- `inventory`: How many copies of the film the video store owns

`customers.json` contains information about the customers that have rented with the store in the past. The data is presented as, you guessed it, an array of objects, with each object have the following key-value pairs:

- `id`: A unique identifier
- `name`: The customer's name
- `registered_at`: When the customer first visited the store
- The customer's physical address, composed of:
  - `address`
  - `city`
  - `state`
  - `postal_code`
- `phone`: Primary contact phone number
- `account_credit`: For reason we'd rather not get into, the store owes all of their customers a little bit of money; this amount is made available to customers as credit toward future rentals.

## Project Baseline

- Read the API Requirements below and create a pseudo-code "routes" file that
  - defines the _endpoints_ your API will need
  - the _HTTP verbs_ each endpoint will use
  - and any data that must be provided to the endpoint in order for it to do its work.
- Create a new Node/Express app to serve as the API.
- Create a route that responds to `/zomg` that serves a json-encoded "it works!" method.
- Seed your database using the provided json data.

## API Requirements

The API you build should have the following capabilities. The schema of your database/datastore, and the structure of the endpoints are completely up to you.

### Authentication
- There is not an authentication requirement for this project; assume all users interacting with the API are video store employees.


## Using this API

### _Setup_
- npm run db:setup to seed database
- DB=test npm run db:schema to setup the test database

### index
- Get zomg GET /

### Customers
- Retrieve a list of all customers
  - GET /Customers
- Retrieve a subset of customers
  - Given a sort column, return _n_ customer records, offset by _p_ records (this will be used to create "pages" of customers)
  - Sort columns are
    - `name` GET customers/name/:records/:offset
    - `registered_at` GET customers/registered/:records/:offset
    - `postal_code` GET customers/postal/:records/:offset
- Given a customer's `id`...
  - List the movies they _currently_ have checked out
    - GET customers/current/:id
  - List the movies a customer has checked out in the past
    - ordered by check out date
    - includes return date
    - GET customers/history/:id

### Movies
- Retrieve a list of all movies
  - GET /movies
- Retrieve a subset of movies
  - Given a sort column, return _n_ movie records, offset by _p_ records (this will be used to create "pages" of movies)
  - Sort columns are
    - `title` GET movies/title/:records/:offset
    - `release_date` GET movies/released/:records/:offset

  - Look a movie up by title to see
    - it's synopsis
    - release date
    - and inventory total
    - Know if a movie has any inventory available to rent
    - GET movies/:title

### Rentals

- See a list of customers that have _currently_ checked out any of the movie's inventory
  - GET rentals/customers/current
- Given a movie's `title`...
  - Get a list of customers that have _currently_ checked out a copy of the film
    - GET rentals/checkedout/:title
  - Get a list of customers that have checked out a copy _in the past_
    - ordered by customer `id`
      - GET rentals/history/id/:title
    - ordered by customer `name`
      - GET rentals/history/name/:title
    - ordered by check out date
      - GET rentals/history/:title
- Given a customer's `id` and a movie's `title` ...
  - "check out" one of the movie's inventory to the customer
    - Establish a return date
    - Charge the customer's account (cost up to you)
      - POST rentals/checkout/:title/:customer_id
  - "check in" one of customer's rentals
    - return the movie to its inventory
      - PUT /rentals/checkin/:title/:customer_id
- See a list of customers with overdue movies
  - GET rentals/customers/overdue

### Interface
- This part of the project is purely an API; all interactions should happen over HTTP requests. There is no front-end, user-facing interface.

### Testing
- All endpoints must be tested.
- We will use [Mocha](https://mochajs.org/) for tests.
- There isn't a coverage requirement for this project, beyond demonstrating that every endpoint is covered by some manner of tests.
