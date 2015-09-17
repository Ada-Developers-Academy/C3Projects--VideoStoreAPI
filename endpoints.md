# Video Store Project Routes  
The following are all the endpoints available from our Video Store API.

## Customer

__Endpoint__  
`GET ./customers`   
Returns all the information on record of all of our customers.

__Request Parameters__  

| Query Parameter     | Value          |
| :-------------------| :------------- |
| `order_by `           | _Optional._ Provide this parameter if you would like the customers sorted. Options include: `name`, `registered_at`, or `postal_code`.        |

__Response Format__  

    {
      "customers" : [
        {
          "id": 1,
          "name": "Shelley Rocha",
          "registered_at": "Wed, 29 Apr 2015 07:54:14 -0700",
          "address": "Ap #292-5216 Ipsum Rd.",
          "city": "Hillsboro",
          "state": "OR",
          "postal_code": "24309",
          "phone": "(322) 510-8695",
          "account_credit": 13.15
        },
        {
          "id": "2",
          "name": "Curran Stout",
          "registered_at": "Wed, 16 Apr 2014 21:40:20 -0700",
          "address": "Ap #658-1540 Erat Rd.",
          "city": "San Francisco",
          "state": "California",
          "postal_code": "94267",
          "phone": "(908) 949-6758",
          "account_credit": 35.66
        }
        …
      ]
    }

 returns n number of customers (hardcoded?) sorted by name  
 offset by p records (hardcoded)  
  all of the attr of customers  

***

__Endpoint__  
`GET /customers/{:id}`  
  all of the attr of that customer
  currently checked out movies
   all movies with that customer_id and return_date == nil
     include id, title

  movies checked out in the past
   all movies with that customer_id and return_date != nil (sort ASC by checkout_date)
     include id, title and return_date

__Request Parameter__  

  | Path Parameter  | Value              |
  | :---------------| :----------------- |
  | `id `           | The customer's ID. |

__Response__

    {
      "customer": {
        "renting": [
          {
            "id": 1
            "title": "Psycho",
            "checkout_date": "",
            "due_date": "" ,
            "return_date": null
          },
          {
            "id": 2
            "title": "Jaws",
            "checkout_date": "",
            "due_date": "",
            "return_date": null
          }
        ],
        "rented" : [
          {
            "id": 8
            "title": "The French Connection",
            "checkout_date": "",
            "due_date": "",
            "return_date": ""
          }
        ]
      }
    }


## MOVIES

__Endpoint__  
`GET ./movies`  
Returns all of the movies in our database with their complete information.

__Request Parameters__  

| Query Parameter     | Value          |
| :-------------------| :------------- |
| `order_by`            | _Optional._ Provide this parameter if you would like the customers sorted. Options include: `title` or `release_date`.        |

__Response__


  GET '/movies&order_by="title"'
   returns n number of movies (hardcoded?) sorted by title
   offset by p records (hardcoded)

  GET '/movies&order_by="release_date"'
   returns n number of movies (hardcoded?) sorted by release_date
   offset by p records (hardcoded)

***

__Endpoint__  
`GET ./movies/{:title}`  
Returns movies that match the title query.

__Request Parameters__  

| Path Parameter     | Value          |
| :------------------| :------------- |
| `title`            |  The title of the movie. |

__Response__

    {
      "movies" : [
      {
        "title": "The Night of the Hunter",
        "overview": "Harry Powell marries and murders widows for their money, believing he is helping God do away with women who arouse men's carnal instincts. Arrested for auto theft, he shares a cell with condemned killer Ben Harper and tries to get him to reveal the whereabouts of the $10,000 he stole. Only Ben's nine-year-old son, John, and four-year-old daughter, Pearl, know the money is in Pearl's doll; and they have sworn to their father to keep this secret. After Ben is executed, Preacher goes to Cresap's Landing to court Ben's widow, Willa. When he overwhelms her with his Scripture quoting, sermons, and hymns, she agrees to marry him. On their wedding night, he tells her they will never have sex because it is sinful.",
        "release_date": "1955-07-26",
        "inventory": 9
      },
      {
        "title": "Night of the Living Dead",
        "overview": "A group of people try to survive an attack of bloodthirsty zombies while trapped in a rural Pennsylvania farmhouse. Although not the first zombie film, Night of the Living Dead is the progenitor of the contemporary \"zombie apocalypse\" horror film, and it greatly influenced the modern pop-culture zombie archetype.",
        "release_date": "1968-10-01",
        "inventory": 9
      },
      ]
    }

GET '/movies/:title/customers'  default is sorting by id
GET '/movies/:title/customers&order_by="name"'
GET '/movies/:title/customers&order_by="checkout_date"'
  { current_customers:
    [ customer1 : { name: blah, ... },
      customer2: { etc } ],  customers CURRENTLY checked out this movie

    previous_customers:
    [customers PREVIOUSLY who checked out this movie]
  }

## RENTALS

__Endpoint__  
`POST /customers/{:id}/rental/{:title}`  
   maybe change it be searching for movie id instead of movie title?

   creates new rental entry
     customer_id, movie_id, checkout_date, due_date of +7 days later, return_date == nil
   on success...

    PUT   updates inventory_avail -1 for that movie
          updates customer account_credit -$X rental fee

RENTALS-- Checkin *******

PUT '/customers/:id/rental/:title'
   updates return_date to Time.now (rental record)
   updates inventory_avail +1 for that movie

GET '/rentals/overdue'
   array of customers with all their overdue movies
     overdue = current_date > due_date && return_date == nil

    { customers: [
      { name1 : "something",
        overdue_movies: [
          { title1 : "",
            release_date : dateTime,
          },
          { title2 : "",
            release_date : dateTime,
          }
        ]
      },

      { name2 : "something",
        overdue_movies: [
          { title1 : "",
            release_date : dateTime,
          },
          { title2 : "",
            release_date : dateTime,
          }
        ]
      },
      ]
    }
