#Anita & Alice's Video Store

See below for the available endpoints for this API.

1. [All Customers](#all-customers)  
2. [Single Customer](#single-customer)  
3. [Subset of Customers](#subset-of-customers)  
4. [All Movies](#all-movies)  
5. [Single Movie](#single-movie)  
6. [Subset of Movies](#subset-of-movies)  
7. [Overdue Rentals](#overdue-rentals)  
8. [Rental History of Single Movie](#rental-history-of-single-movie)  
9. [Rent Movie](#rent-movie)  
10. [Return Movie](#return-movie)  

##Customers

###All Customers
- GET `/customers`
- Retrieves a list of all customers.
- Returns an object with a `customers` property containing an array of customer objects.
- Each customer object contains the following properties: `id`, `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
- Sample: GET `/customers`
```json
{
    "customers": [{
        "id": 1,
        "name": "Shelley Rocha",
        "registered_at": "Wed, 29 Apr 2015 07:54:14 -0700",
        "address": "Ap #292-5216 Ipsum Rd.",
        "city": "Hillsboro",
        "state": "OR",
        "postal_code": "24309",
        "phone": "(322) 510-8695",
        "account_credit": 1315
    }, {
        "id": 2,
        "name": "XCurran Stout",
        "registered_at": "Wed, 16 Apr 2014 21:40:20 -0700",
        "address": "Ap #658-1540 Erat Rd.",
        "city": "San Francisco",
        "state": "California",
        "postal_code": "94267",
        "phone": "(908) 949-6758",
        "account_credit": 3565.9999999999995
    }, {
        "id": 3,
        "name": "Roanna Robinson",
        "registered_at": "Fri, 28 Nov 2014 13:14:08 -0800",
        "address": "Ap #561-4214 Eget St.",
        "city": "Harrisburg",
        "state": "PA",
        "postal_code": "15867",
        "phone": "(323) 336-1841",
        "account_credit": 5039
    }, {
        "id": 4,
        "name": "Carolyn Chandler",
        "registered_at": "Fri, 04 Jul 2014 11:05:11 -0700",
        "address": "133-8707 Arcu. Avenue",
        "city": "Fort Wayne",
        "state": "IN",
        "postal_code": "73684",
        "phone": "(234) 837-2886",
        "account_credit": 2079
    }, {
        "id": 5,
        "name": "Aquila Riddle",
        "registered_at": "Thu, 27 Aug 2015 08:17:24 -0700",
        "address": "Ap #187-9582 Primis St.",
        "city": "Tacoma",
        "state": "WA",
        "postal_code": "73251",
        "phone": "(925) 161-2223",
        "account_credit": 1782
    }]
}
```

###Single Customer

- GET `/customers/:id`
- Retrieves data about the customer identified by the `id` passed in the URL.
- Returns an object with `customer_data` and `movies` properties.
  - `customer_data` contains the following properties: `id`, `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
  - `movies` contains: `current_rentals` and `past_rentals`.
    - `current_rentals` is a list of movies rented by the customer.
      - Each movie object contains the following propeties: `id`, `title`, `overview`, `release_date`, and `inventory`.
    - `past_rentals` is a list of movie objects.
      - Each movie object contains `movie_data` and `dates`.
        - `dates` contains `checkout_date` and `returned_date`.
        - `movie_data` contains: `id`, `title`, `overview`, `release_date`, and `inventory`.
- Sample: GET `/customers/1`
```json
{
    "customer_data": {
        "id": 1,
        "name": "Shelley Rocha",
        "registered_at": "Wed, 29 Apr 2015 07:54:14 -0700",
        "address": "Ap #292-5216 Ipsum Rd.",
        "city": "Hillsboro",
        "state": "OR",
        "postal_code": "24309",
        "phone": "(322) 510-8695",
        "account_credit": 1315
    },
    "movies": {
        "current_rentals": [{
            "id": 2,
            "title": "Jaws",
            "overview": "An insatiable great white shark terrorizes the townspeople of Amity Island, The police chief, an oceanographer and a grizzled shark hunter seek to destroy the bloodthirsty beast.",
            "release_date": "1975-06-19",
            "inventory": 6
        }, {
            "id": 3,
            "title": "The Exorcist",
            "overview": "12-year-old Regan MacNeil begins to adapt an explicit new personality as strange events befall the local area of Georgetown. Her mother becomes torn between science and superstition in a desperate bid to save her daughter, and ultimately turns to her last hope: Father Damien Karras, a troubled priest who is struggling with his own faith.",
            "release_date": "1973-12-26",
            "inventory": 7
        }, {
            "id": 5,
            "title": "The Silence of the Lambs",
            "overview": "FBI trainee Clarice Starling ventures into a maximum-security asylum to pick the diseased brain of Hannibal Lecter, a psychiatrist turned homicidal cannibal. Starling needs clues to help her capture a serial killer. Unfortunately, her Faustian relationship with Lecter soon leads to his escape, and now two deranged killers are on the loose.",
            "release_date": "1991-02-14",
            "inventory": 3
        }, {
            "id": 49,
            "title": "Ben-Hur",
            "overview": "Ben-Hur is a 1959 epic film directed by William Wyler, the third film version of Lew Wallace's 1880 novel Ben-Hur: A Tale of the Christ. It premiered at Loew's State Theatre in New York City on November 18, 1959. The film went on to win a record of eleven Academy Awards, including Best Picture, a feat equaled only by Titanic in 1998 and The Lord of the Rings: The Return of the King in 2004. It was also the last film to win the Oscar for both Best Actor and Best Supporting Actor, until nearly 44 years later when Mystic River achieved the same feat.The movie revolves around a Jewish prince who is betrayed and sent into slavery by a Roman friend and how he regains his freedom and comes back for revenge.",
            "release_date": "1959-11-18",
            "inventory": 5
        }, {
            "id": 84,
            "title": "Poltergeist",
            "overview": "Craig T. Nelson stars as Steve Freeling, the main protagonist, who lives with his wife, Diane, (JoBeth Williams) and their three children, Dana (Dominique Dunne), Robbie (Oliver Robins), and Carol Anne (Heather O'Rourke), in Southern California where he sells houses for the company that built the neighborhood. It starts with just a few odd occurrences, such as broken dishes and furniture moving around by itself. However, a tree comes alive and takes Robbie through his bedroom window, and Carol Anne is abducted by ghosts. Realizing that something evil haunts his home, Steve calls in a team of parapsychologists led by Dr. Lesh (Beatrice Straight) to investigate, hoping to get Carol Anne back, so he can remove his family from the house before it's too late.",
            "release_date": "1982-06-04",
            "inventory": 4
        }, {
            "id": 99,
            "title": "Speed",
            "overview": "Los Angeles SWAT cop Jack Traven is up against bomb expert Howard Payne, who's after major ransom money. First it's a rigged elevator in a very tall building. Then it's a rigged bus--if it slows, it will blow, bad enough any day, but a nightmare in LA traffic. And that's still not the end.",
            "release_date": "1994-06-09",
            "inventory": 10
        }],
        "past_rentals": [{
            "dates": {
                "returned_date": "07 Dec 2008 06:19:02",
                "checkout_date": "03 Dec 2008 02:58:43"
            },
            "movie_data": {
                "id": 39,
                "title": "Die Hard",
                "overview": "NYPD cop John McClane's plan to reconcile with his estranged wife, Holly, is thrown for a serious loop when minutes after he arrives at her office, the entire building is overtaken by a group of pitiless terrorists. With little help from the LAPD, wisecracking McClane sets out to single-handedly rescue the hostages and bring the bad guys down.",
                "release_date": "1988-07-14",
                "inventory": 4
            }
        }, {
            "dates": {
                "returned_date": "07 Dec 2009 06:19:02",
                "checkout_date": "03 Dec 2009 02:58:43"
            },
            "movie_data": {
                "id": 72,
                "title": "Platoon",
                "overview": "Chris Taylor, a young, naive recruit in Vietnam, faces a moral crisis when confronted with the horrors of war and the duality of man.",
                "release_date": "1986-12-18",
                "inventory": 1
            }
        }, {
            "dates": {
                "returned_date": "14 May 2011 02:58:43",
                "checkout_date": "10 May 2011 02:58:43"
            },
            "movie_data": {
                "id": 68,
                "title": "Halloween",
                "overview": "A psychotic murderer institutionalized since childhood for the murder of his sister, escapes and stalks a bookish teenage girl and her friends while his doctor chases him through the streets.",
                "release_date": "1978-10-25",
                "inventory": 4
            }
        }, {
            "dates": {
                "returned_date": "14 May 2011 02:58:43",
                "checkout_date": "10 May 2011 02:58:43"
            },
            "movie_data": {
                "id": 100,
                "title": "The Adventures of Robin Hood",
                "overview": "Robin Hood (Errol Flynn) fights nobly for justice against the evil Sir Guy of Gisbourne (Basil Rathbone) while striving to win the hand of the beautiful Maid Marian (Olivia de Havilland).",
                "release_date": "1938-05-14",
                "inventory": 3
            }
        }]
    }
}
```

###Subset of Customers

- GET `/customers/:sort_by/:limit/:offset`
- Sorts the entire set of customers by a certain property (`sort_by`), then retrieves a number (`limit`) of customers, starting at a certain index (`offset`).
  - `sort_by` accepts `name` (customer name), `registered_at` (registration date), or `postal_code`.
  - `limit` must be an integer >= 0.
  - `offset` must be an integer >= 0.
- Returns an object with a `customers` property containing an array of customer objects.
- Each customer object contains the following properties: `id`, `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
- Sample: GET `/customers/name/2/2`
```json
{
    "customers": [{
        "id": 155,
        "name": "Abigail Lara",
        "registered_at": "Wed, 12 Aug 2015 03:21:43 -0700",
        "address": "P.O. Box 388, 1190 Donec St.",
        "city": "Shreveport",
        "state": "Louisiana",
        "postal_code": "41243",
        "phone": "(235) 178-3417",
        "account_credit": 8856
    }, {
        "id": 46,
        "name": "Acton Gilliam",
        "registered_at": "Thu, 26 Feb 2015 20:00:53 -0800",
        "address": "Ap #508-8214 Senectus Av.",
        "city": "Portland",
        "state": "Oregon",
        "postal_code": "62594",
        "phone": "(903) 973-1984",
        "account_credit": 4864
    }]
}
```

##Movies

###All Movies

- GET `/movies`
- Retrieves a list of all movies.
- Returns an object with a `movies` property containing an array of movie objects.
- Each movie object contains the following properties: `id`, `title`, `overview`, `release_date`, and `inventory`.
- Sample: GET `/movies`
```json
{
    "movies": [{
        "id": 1,
        "title": "Psycho",
        "overview": "When larcenous real estate clerk Marion Crane goes on the lam with a wad of cash and hopes of starting a new life, she ends up at the notorious Bates Motel, where manager Norman Bates cares for his housebound mother. The place seems quirky, but fine… until Marion decides to take a shower.",
        "release_date": "1960-06-16",
        "inventory": 8
    }, {
        "id": 2,
        "title": "Jaws",
        "overview": "An insatiable great white shark terrorizes the townspeople of Amity Island, The police chief, an oceanographer and a grizzled shark hunter seek to destroy the bloodthirsty beast.",
        "release_date": "1975-06-19",
        "inventory": 6
    }, {
        "id": 3,
        "title": "The Exorcist",
        "overview": "12-year-old Regan MacNeil begins to adapt an explicit new personality as strange events befall the local area of Georgetown. Her mother becomes torn between science and superstition in a desperate bid to save her daughter, and ultimately turns to her last hope: Father Damien Karras, a troubled priest who is struggling with his own faith.",
        "release_date": "1973-12-26",
        "inventory": 7
    }, {
        "id": 4,
        "title": "North by Northwest",
        "overview": "Madison Avenue advertising man Roger Thornhill finds himself thrust into the world of spies when he is mistaken for a man by the name of George Kaplan. Foreign spy Philip Vandamm and his henchman Leonard try to eliminate him but when Thornhill tries to make sense of the case, he is framed for murder. Now on the run from the police, he manages to board the 20th Century Limited bound for Chicago where he meets a beautiful blond, Eve Kendall, who helps him to evade the authorities. His world is turned upside down yet again when he learns that Eve isn't the innocent bystander he thought she was. Not all is as it seems however, leading to a dramatic rescue and escape at the top of Mt. Rushmore.",
        "release_date": "1959-07-17",
        "inventory": 10
    }, {
        "id": 5,
        "title": "The Silence of the Lambs",
        "overview": "FBI trainee Clarice Starling ventures into a maximum-security asylum to pick the diseased brain of Hannibal Lecter, a psychiatrist turned homicidal cannibal. Starling needs clues to help her capture a serial killer. Unfortunately, her Faustian relationship with Lecter soon leads to his escape, and now two deranged killers are on the loose.",
        "release_date": "1991-02-14",
        "inventory": 3
    }]
}
```

###Single Movie

- GET `/movies/:title/:order`
- `order` accepts `name` (customer name), `id` (customer id), and `checkout_date`.
- Retrieves data about the movie identified by the `title` passed in the URL, with past customers sorted in the `order` passed in the URL.
- Returns an object with `movie_data` and `customers` properties.
  - `movie_data` contains the following properties: `id`, `title`, `overview`, `release_date`, and `inventory`.
  - `customers` contains: `current_renters` and `past_renters`.
    - `current_renters` is a list of customers who have an unreturned rental of the movie.
      - Each customer object contains the following propeties: `id`, `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
    - `past_renters` is a list of customer objects.
      - Each customer object contains `customer_data` and `dates`.
        - `dates` contains `checkout_date`.
        - `customer_data` contains: `id`, `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
- Sample: GET `/movies/The Guns of Navarone/name`
```json
{
    "movie_data": {
        "id": 89,
        "title": "The Guns of Navarone",
        "overview": "A team of allied saboteurs are assigned an impossible mission: infiltrate an impregnable Nazi-held island and destroy the two enormous long-range field guns that prevent the rescue of 2,000 trapped British soldiers.",
        "release_date": "1961-06-22",
        "inventory": 3
    },
    "customers": {
        "current_renters": [{
            "id": 4,
            "name": "Carolyn Chandler",
            "registered_at": "Fri, 04 Jul 2014 11:05:11 -0700",
            "address": "133-8707 Arcu. Avenue",
            "city": "Fort Wayne",
            "state": "IN",
            "postal_code": "73684",
            "phone": "(234) 837-2886",
            "account_credit": 2079
        }],
        "past_renters": [{
            "dates": {
                "checkout_date": "2009-12-03T10:58:43.000Z"
            },
            "customer_data": {
                "id": 3,
                "name": "Roanna Robinson",
                "registered_at": "Fri, 28 Nov 2014 13:14:08 -0800",
                "address": "Ap #561-4214 Eget St.",
                "city": "Harrisburg",
                "state": "PA",
                "postal_code": "15867",
                "phone": "(323) 336-1841",
                "account_credit": 5039
            }
        }, {
            "dates": {
                "checkout_date": "1999-10-03T07:25:08.000Z"
            },
            "customer_data": {
                "id": 2,
                "name": "XCurran Stout",
                "registered_at": "Wed, 16 Apr 2014 21:40:20 -0700",
                "address": "Ap #658-1540 Erat Rd.",
                "city": "San Francisco",
                "state": "California",
                "postal_code": "94267",
                "phone": "(908) 949-6758",
                "account_credit": 3565.9999999999995
            }
        }]
    }
}
```

### Subset of Movies
- GET `/movies/:sort_by/:limit/:offset`
- Sorts the entire set of movies by a certain property (`sort_by`), then retrieves a number (`limit`) of movies, starting at a certain index (`offset`).
  - `sort_by` accepts `title` and `release_date`.
  - `limit` must be an integer >= 0.
  - `offset` must be an integer >= 0.
- Returns an object with a `movies` property containing an array of movie objects.
- Each movie object contains the following properties: `id`, `title`, `overview`, `release_date`, and `inventory`.
- Sample: GET `/movies/title/2/2`
```json
{
    "movies": [{
        "id": 21,
        "title": "A Clockwork Orange",
        "overview": "The head of a gang of toughs, in an insensitive futuristic society, is conditioned to become physically ill at sex and violence during a prison sentence. When he is released, he's brutally beaten by all of his old adversaries.",
        "release_date": "1971-12-18",
        "inventory": 4
    }, {
        "id": 6,
        "title": "Alien",
        "overview": "During its return to the earth, commercial spaceship Nostromo intercepts a distress signal from a distant planet. When a three-member team of the crew discovers a chamber containing thousands of eggs on the planet, a creature inside one of the eggs attacks an explorer. The entire crew is unaware of the impending nightmare set to descend upon them when the alien parasite planted inside its unfortunate host is birthed.",
        "release_date": "1979-05-25",
        "inventory": 4
    }]
}
```

##Rentals

###Overdue Rentals
- GET `/rentals/overdue`
- Retrieves a list of all customers with overdue rentals.
- Returns an object with an `overdue_customers` property that contains a list of customer objects.
  - Each customer object contains the following properties: `id`, `name`, `registered_at` (date of registration), `address`, `city`, `state`, `postal_code`, `phone`, and `account_credit` (in cents).
- Sample: GET `/rentals/overdue`
```json

{
    "overdue_customers": [{
        "id": 1,
        "name": "Shelley Rocha",
        "registered_at": "Wed, 29 Apr 2015 07:54:14 -0700",
        "address": "Ap #292-5216 Ipsum Rd.",
        "city": "Hillsboro",
        "state": "OR",
        "postal_code": "24309",
        "phone": "(322) 510-8695",
        "account_credit": 1315
    }, {
        "id": 2,
        "name": "XCurran Stout",
        "registered_at": "Wed, 16 Apr 2014 21:40:20 -0700",
        "address": "Ap #658-1540 Erat Rd.",
        "city": "San Francisco",
        "state": "California",
        "postal_code": "94267",
        "phone": "(908) 949-6758",
        "account_credit": 3565.9999999999995
    }, {
        "id": 3,
        "name": "Roanna Robinson",
        "registered_at": "Fri, 28 Nov 2014 13:14:08 -0800",
        "address": "Ap #561-4214 Eget St.",
        "city": "Harrisburg",
        "state": "PA",
        "postal_code": "15867",
        "phone": "(323) 336-1841",
        "account_credit": 5039
    }, {
        "id": 4,
        "name": "Carolyn Chandler",
        "registered_at": "Fri, 04 Jul 2014 11:05:11 -0700",
        "address": "133-8707 Arcu. Avenue",
        "city": "Fort Wayne",
        "state": "IN",
        "postal_code": "73684",
        "phone": "(234) 837-2886",
        "account_credit": 2079
    }]
}
```

###Rental History of Single Movie
- GET `/rentals/:title`

###Rent Movie
- POST `/rentals/checkout/:customer_id/:movie_title`

###Return Movie
- PUT `/rentals/checkin/:customer_id/:movie_title`
