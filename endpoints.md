# Video Store Project Routes  
The following are all the endpoints available from our Video Store API.

## Customer

__Endpoint__  
`GET ./customers`  

Returns all the information on record of our customers. Can be sorted by `name`, `registered_at`, or `postal_code`. Also can be paginated with `number` and `page` (e.g. display the 2nd page of 20 customer records: `./customers?number=20&page=2`).


__Request Parameters__  

| Query Parameter | Value          |
| :-------------- | :------------- |
| `order_by `     | _Optional._ Provide this parameter if you would like the customers sorted. Options include: `name`, `registered_at`, or `postal_code`. When using `name`, customers are sorted by their first name. |
| `number`        | _Optional._ An integer that represents the number of customer records you'd like returned. |
| `page`          | _Optional, but requires the `number` query._ The page of customer records you'd like returned. |

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

Returns all the information on record of the selected customer, including all the movies they have currently and previously checked out.  

__Request Parameter__  

| Path Parameter  | Value              |
| :---------------| :----------------- |
| `id `           | The customer's ID. |

__Response__

    {
      "account": {
        "id": 2,
        "name": "Curran Stout",
        "registered_at": "Wed, 16 Apr 2014 21:40: -0770"
        "address": ,

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

Returns all of the movies in our database with their complete information. Can be ordered by `title` or `release_date`. Also can be paginated with number and page (e.g. display the 2nd page of 20 customer records: `./movies?number=20&page=2`).

__Request Parameters__  

| Query Parameter     | Value          |
| :-------------------| :------------- |
| `order_by`            | _Optional._ Provide this parameter if you would like the customers sorted. Options include: `title` or `release_date`.        |
| `number`        | _Optional._ An integer that represents the number of customer records you'd like returned. |
| `page`          | _Optional, but requires the `number` query._ The page of customer records you'd like returned. |

__Response__

    {
      "movies": [
        {
          "id": 1,
          "title": "Psycho",
          "overview": "When larcenous real estate clerk Marion Crane goes on the lam with a wad of cash and hopes of starting a new life, she ends up at the notorious Bates Motel, where manager Norman Bates cares for his housebound mother. The place seems quirky, but fine… until Marion decides to take a shower.",
          "release_date": "1960-06-16",
          "inventory_total": 8,
          "inventory_avail": 8
        },
        {
          "id": 2,
          "title": "Jaws",
          "overview": "An insatiable great white shark terrorizes the townspeople of Amity Island, The police chief, an oceanographer and a grizzled shark hunter seek to destroy the bloodthirsty beast.",
          "release_date": "1975-06-19",
          "inventory_total": 6,
          "inventory_avail": 6
        },
        …
      ]
    }

***

__Endpoint__  
`GET ./movies/{:title}`  

Returns movies that fuzzy match the title query. The results are automatically ordered by `movie_id` but can also be ordered by title or release date.

__Request Parameters__  

| Path Parameter     | Value                    |
| :------------------| :------------------------|
| `title`            |  The title of the movie. |
| `order_by`         | _Optional._ Provide this parameter if you would like the customers sorted. Options include: `title` or `release_date`.        |

__Response__

    {
      "movies" : {
          "title": "The Night of the Hunter",
          "overview": "Harry Powell marries and murders widows for their money, believing he is helping God do away with women who arouse men's carnal instincts. Arrested for auto theft, he shares a cell with condemned killer Ben Harper and tries to get him to reveal the whereabouts of the $10,000 he stole. Only Ben's nine-year-old son, John, and four-year-old daughter, Pearl, know the money is in Pearl's doll; and they have sworn to their father to keep this secret. After Ben is executed, Preacher goes to Cresap's Landing to court Ben's widow, Willa. When he overwhelms her with his Scripture quoting, sermons, and hymns, she agrees to marry him. On their wedding night, he tells her they will never have sex because it is sinful.",
          "release_date": "1955-07-26",
          "inventory": 9
        }
      ]
    }

***

## Rentals

__Endpoint__  
`POST ./rentals/{:customer_id}/checkout/{:movie_id}`  

Checks out the given movie for the given customer, automatically setting the rental's return date to 7 days after checkout. It reduces that movie's inventory_avail by 1 and deducts a $3 rental fee from the customer's account_credit.  

__Request Parameters__  

| Path Parameter  | Value                    |
| :---------------| :------------------------|
| `customer_id`   |  The ID of the movie.    |
| `movie_id`      |  The title of the movie. |

__Response__

    {
      "rental": {
        "id": 2,
        "customer_id": "5",
        "name": "Aquila Riddle",
        "movie_id": "",
        "title": "Close Encounters of the Third Kind",
        "checkout_date": "2015-09-13",
        "due_date": "2015-09-20",
        "return_date": null
      }
    }

***

__Endpoint__  
`PUT ./rentals/{:customer_id}/return/{:movie_id}`  

Returns the updated rental information for that checked in movie and that movie's previous rental history in descending order of `return_date`.  

__Request Parameters__  

| Path Parameter  | Value                    |
| :---------------| :------------------------|
| `customer_id`   |  The ID of the movie.    |
| `movie_id`      |  The title of the movie. |

__Response__

    {
      "rental_history": {
        "customer_id": "5",
        "name": "Aquila Riddle",
        "movie_id": "",
        "title": "Close Encounters of the Third Kind",
        "checkout_date": "2015-09-13",
        "due_date": "2015-09-20",
        "return_date": "2015-09-19"
      }
    }

***

__Endpoint__  
`GET /rentals/overdue`  

Returns an array of all rentals that are currently overdue.  

__Response__

    {
      "overdue_movies": [
      { 
        "id": 3,
        "title": "Frankenstein",
        "customer_id": 1,
        "name": "Shelley Rocha",
        "checkout_date": "2014-09-19",
        "due_date": "2014-09-26",
        "return_date": null
      },
      {
        "id": 6,
        "title": "The Night of the Hunter",
        "customer_id": 2,
        "name": "Curran Stout",
        "checkout_date": "2014-09-19",
        "due_date": "2014-09-26",
        "return_date": null
        },
        …
      ]
    }

***

__Endpoint__  
`GET /rentals/title/{:title}`  

Returns an array of the given movie's rental history, grouping them in two sub arrays of 'current_rentals' and 'previous_rentals'. If there are multiple matched movies for the {:title} search, it will pull in all matching results.    

__Response__

    {
      "current_rentals": [
        { 
          "rental_id": 6,
          "movie_title": "The Night of the Hunter",
          "customer_id": 2,
          "customer_name": "Curran Stout",
          "checkout_date": "2014-09-19",
          "due_date": "2014-09-26",
          "return_date": null
        },
        {
          "rental_id": 51,
          "movie_title": "The Night of the Hunter",
          "customer_id": 17,
          "customer_name": "Ginger Heath",
          "checkout_date": "2014-09-19",
          "due_date": "2014-09-26",
          "return_date": null
        }
      ],
      "previous_rentals": [
        {
          "rental_id": 17,
          "movie_title": "The Night of the Hunter",
          "customer_id": 6,
          "customer_name": "Phyllis Russell",
          "checkout_date": "2014-09-09",
          "due_date": "2014-09-16",
          "return_date": "2014-09-10"
        },
        ...
      ]
    }
