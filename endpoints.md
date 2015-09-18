# Video Store Project Routes  
The following are all the endpoints available from our Video Store API.

## Customer

__Endpoint__  
`GET ./customers`   
Returns all the information on record of all of our customers.

returns n number of customers (hardcoded?) sorted by name  
offset by p records (hardcoded)  
 all of the attr of customers  

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


## Movies

__Endpoint__  
`GET ./movies`  
Returns all of the movies in our database with their complete information.

returns n number of movies (hardcoded?) sorted by title  
offset by p records (hardcoded)

__Request Parameters__  

| Query Parameter     | Value          |
| :-------------------| :------------- |
| `order_by`            | _Optional._ Provide this parameter if you would like the customers sorted. Options include: `title` or `release_date`.        |

__Response__

    {
      "movies": [

      ]
    }

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
        }
      ]
    }

***

__Endpoint__  
`GET /movies/{:title}/customers`
default is sorting by id

__Request Parameters__  

| Path Parameter     | Value                    |
| :------------------| :----------------------- |
| `title`            |  The title of the movie. |

| Query Parameter    | Value                    |
| :------------------| :----------------------- |
| `order_by`         |  _Optional._ Provide this parameter if you would like the customers sorted. Options include: `name` or `checkout_date`. |

__Response__

    {
      "current_customers": [
        {
          "id": "5",
          "name": "Aquila Riddle",
          "registered_at": "Thu, 27 Aug 2015 08:17:24 -0700",
          "address": "Ap #187-9582 Primis St.",
          "city": "Tacoma",
          "state": "WA",
          "postal_code": "73251",
          "phone": "(925) 161-2223",
          "account_credit": 17.82
        },
        {
          "id": "6",
          "name": "Phyllis Russell",
          "registered_at": "Wed, 02 Apr 2014 21:44:46 -0700",
          "address": "746-8511 Ipsum Ave",
          "city": "Boise",
          "state": "Idaho",
          "postal_code": "76759",
          "phone": "(961) 964-5158",
          "account_credit": 88.67
        }
      ],
      "previous_customers": [
        {
          "id": "9",
          "name": "Jacqueline Perry",
          "registered_at": "Thu, 23 Jul 2015 10:18:35 -0700",
          "address": "Ap #288-7228 Dis Rd.",
          "city": "Anchorage",
          "state": "AK",
          "postal_code": "99789",
          "phone": "(479) 207-8414",
          "account_credit": 96.28
        },
        {
          "id": "5",
          "name": "Aquila Riddle",
          "registered_at": "Thu, 27 Aug 2015 08:17:24 -0700",
          "address": "Ap #187-9582 Primis St.",
          "city": "Tacoma",
          "state": "WA",
          "postal_code": "73251",
          "phone": "(925) 161-2223",
          "account_credit": 17.82
        },
         …
      ]
    }


## Rentals

__Endpoint__  
`POST /customers/{:id}/rental/{:title}`    
maybe change it be searching for movie id instead of movie title?

Creates a new rental entry.

PUT   updates inventory_avail -1 for that movie
      updates customer account_credit -$X rental fee

__Request Parameters__  

| Path Parameter  | Value                    |
| :---------------| :------------------------|
| `id`            |  The ID of the movie.    |
| `title`         |  The title of the movie. |

__Response__

    {
      "1": {
        "customer_id": "5",
        "name": "Aquila Riddle",
        "movie_id": "",
        "title": "Close Encounters of the Third Kind",
        "checkout_date": "Thu, Sept 17 2015 16:26:30 -0700",
        "due_date": "Fri, Sept 25 2015 00:00:00 -0700",
        "return_date": null
      }
    }

***

__Endpoint__  
`PUT /customers/{:id}/rental/{:title}`  
updates return_date to Time.now (rental record)
updates inventory_avail +1 for that movie

__Request Parameters__  

| Path Parameter  | Value                    |
| :---------------| :------------------------|
| `id`            |  The ID of the movie.    |
| `title`         |  The title of the movie. |

__Response__

    {
      "rental": {
        "customer_id": "5",
        "name": "Aquila Riddle",
        "movie_id": "",
        "title": "Close Encounters of the Third Kind",
        "checkout_date": "Thu, Sept 17 2015 16:26:30 -0700",
        "due_date": "Fri, Sept 25 2015 00:00:00 -0700",
        "return_date": "Wed, Sept 23 2015 04:20:45 -0700"
      }
    }

***

__Endpoint__  
`GET /rentals/overdue`  
array of customers with all their overdue movies  
overdue = current_date > due_date && return_date == nil

__Response__

    {
      "customers": [
        {
          "id": "6",
          "name" : "Phyllis Russell",
          "overdue_movies": [
            {
              "id":
              "title" : "",
            },
            {
              "id":
              "title" : "",
            }
          ]
        },

        {
          "id": "4",
          "name" : "Carolyn Chandler",
          "overdue_movies": [
            {
              "id":
              "title" : "",
            }
          ]
        },
        …
      ]
    }
