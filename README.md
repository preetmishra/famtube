# FamTube

An application to fetch YouTube videos and search through them.

## Features
* A GET API which returns the stored video data in a paginated response sorted in descending order of published datetime.
  * Supports searching through the title and description with partial match. For instance, "how to make tea?" could be searched with "tea how" or "tea make".
  * Written in JavaScript.
* A YouTube microservice which periodically scrapes data from YouTube and puts it in the database.
  * Supports supplying multiple API keys so that if the quota is exhausted on one, it automatically uses the next available key.
  * Written in Python.
* A dashboard to see all the videos and search through them.
  * Built with React.
  
## Architecture

![image](https://user-images.githubusercontent.com/43616959/204075197-fffab5bd-f742-42a3-b0e9-9303d61ad43a.png)

## Components
### Application Server (/api)
* Provides REST API to list and search through the scraped videos.
* Interacts with MongoDB and the client.

### YouTube Microservice (/youtube)
* Fetches videos from YouTube periodically (per 10 seconds) and puts them in the database.
* Interacts with MongoDB.

### Client (/client)
* Client interface to use the application.
* Interacts with the Application Server.

## Design Decisions

### Why a NoSQL over a SQL database?
* The application doesn't need any transactions (ACID compliance).
* Given the use cases, the application can value availability over consistency. Eventual consistency would be okay.
* NoSQL databases are easier to scale horizontally.

### What's indexed and why?
* `videoId` to ensure uniqueness quickly.
* `publishedAt` to support fast sorting in reverse chronological order.
* Special index: `title` and `description` as `text` index to support partial search. MongoDB supports [text indexes](https://www.mongodb.com/docs/manual/core/index-text/) out of the box to improve searching. Note that something like ElasticSearch would give us more capabilities. Though, due to time limitations, I didn't opt for it for the limited use case.

### Why YouTube Microservice was taken out from the Application Server?
* It is better to keep YouTube separate from the Application Server so that there's a separation of concerns. The application server doesn't need to be bothered about scheduling jobs and should be allowed to utilize its full computing power to support API requests.
* Since they both serve different use cases for our application, they could be scaled independently based on their individual loads and needs.

## Running

### Configuration
#### YouTube Microservice (youtube/src/.env)
```
YOUTUBE_API_KEYS=<API_KEY_1>, <API_KEY_2>, <API_KEY_N>
MONGODB_HOST=mongo
MONGODB_PORT=27017
QUERY=football # Defaults to "official"
```

#### Application Server (api/.env)
```
MONGODB_URI=mongodb://mongo:27017/famtube
PORT=2917
```

#### Client (client/.env)
```
REACT_APP_API=http://localhost:29171
```

### Set up
1. Clone the repository
2. Run `sudo docker-compose up -d` to bring the stack up
3. Run `sudo docker-compose down` to bring the stack down

### Services
* /api: `localhost:29171`
* /client: `localhost:29172`
* MongoDB: Host: localhost, Port: `29170` outside the Docker network

### Logs
* /youtube: `sudo docker logs -f famtube_youtube`
* /api: `sudo docker logs -f famtube_api`
* /client: `sudo docker logs -f famtube_client`

### API
Use `Postman` to test the following. (Refer to the API documentation section for any further details.)

```
localhost:29171/videos
localhost:29171/videos?pageNumber=0&pageLimit=7
localhost:29171/videos?pageNumber=0&pageLimit=7&query=<something>
```

### Important
* To make it easier to test the application, I've pushed all the .envs in a commit. I wouldn't recommend this in production. In addition, I've used unconventional ports for all the services to avoid conflict with something that you're already running on your computer. To update ports, make changes in the respective `.envs` and `docker-compose.yml`.
* Make sure you bring the docker-compose down and fire it up again to reload the `.envs` or whenever you make any other changes. The docker-compose setup doesn't currently support live/hot reload.
* If all the YouTube keys are expired, please put in another YouTube key to test. Tail the logs to understand what's happening.

## API Documentation

### /videos
* Method: `GET`
* Parameters:
  * `pageNumber`: To set the page number. Defaults to 0.
  * `pageLimit`: To set the number of records to be fetched per page. Defaults to 5.
  * `query`: To search for a particular query. By default, returns all the records.
* Response:
  * Records in reverse chronological order with pagination support.
  * Status code: 200
 
#### Success  
```
{
  "data": [
    {
      "_id": "6381ab3b8242ece1e292d51a",
      "videoId": "F17Xx0Go26Y",
      "title": "Florida vs Florida State LIVE | NCAAF 2022 | College Football Week 13",
      "description": "NCAAF2022 #CollegeFootball #Alabama #Georgia.",
      "publishedAt": "2022-11-26T05:28:23.000Z",
      "thumbnails": {
        "default": "https://i.ytimg.com/vi/F17Xx0Go26Y/default.jpg",
        "medium": "https://i.ytimg.com/vi/F17Xx0Go26Y/mqdefault.jpg",
        "high": "https://i.ytimg.com/vi/F17Xx0Go26Y/hqdefault.jpg"
      }
    },
    ....
  "pagination": {
    "total": 116,
    "currentPageNumber": 0,
    "pageLimit": 5
  }
}
```

#### Error
```
{
  "status": 500,
  "message": "Something went wrong while querying the database"
}
```

## Screenshots

### Client (default)
![image](https://user-images.githubusercontent.com/43616959/204076768-26bfecd3-3ce3-42de-95e2-e71c735a8f95.png)
![image](https://user-images.githubusercontent.com/43616959/204076775-108be45d-4cee-478c-a949-3e7bfe302898.png)

### Client (partial search, see how "Melville United Auckland" finds a document with "Football: NL - Auckland city v Melville United"
![image](https://user-images.githubusercontent.com/43616959/204077467-7c19b5b1-3271-4b58-80ba-4822dfef824f.png)

### YouTube Microservice (switching API keys that have expired)
![8402e6bf-d024-473a-b8a7-a0c10711d7e0](https://user-images.githubusercontent.com/43616959/204076852-59e88fe5-0dd1-4abf-8929-ffba57b9fb08.jpeg)



## Author
Preet Mishra
