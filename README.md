
# Weather, NASA, and Movie API Integration

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Dependencies](#dependencies)
- [MongoDB](#mongodb)
- [Installation](#installation)
- [REST](#rest-api)
- [APIs Used](#apis-used)
- [Authorization](#authorization)
- [Admin](#admin)
- [Usage](#usage)
- [Contributing](#contributing)

## Introduction

Discover tour booking experiences with my REST API-integrated platform. From browsing and booking tours to accessing destination and airline details. 

## Features

- REST API for creating, viewing, updating and deleting travel tours
- Admin Panel for modifying tour&user info, and performing CRUD operations
- Airlines API for retrieving data about different airlines
- Desinations API for viewing different destinations of specific region/city
- Authorization for accessing the full functionality of web app

## Dependencies

- axios: ^1.6.7
- bcrypt: ^5.1.1
- body-parser: ^1.20.2
- cookie-parser: ^1.4.6
- cors: ^2.8.5
- ejs: ^3.1.9
- express: ^4.18.2
- express-session: ^1.18.0
- jsonwebtoken: ^9.0.2
- method-override: ^3.0.0
- mongoose: ^8.1.3
- multer: ^1.4.5-lts.1
- nodemon: ^3.0.3

## MongoDB:
```bash
 mongodb+srv://vuilae:Aa102030@cluster0.jpwdrod.mongodb.net/?retryWrites=true&w=majority
  ```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/vuilae/finalForWeb.git
   
2. Install dependencies::

   ```bash
   npm install
   
2. Run the Server:

   ```bash
   npm start

## Rest-api
REST API for travel tours&booking. Admin can create, edit, delete and view tour info. User can book this tour.
![image](https://github.com/vuilae/finalForWeb/assets/114561182/4e71547f-ad4a-4889-ab88-1254322a61a6)

![image](https://github.com/vuilae/finalForWeb/assets/114561182/51387766-4399-4805-b532-69041187f57d)

   
## Apis-used

## 1. Airlines API - https://api-ninjas.com/api/airlines
Returns airlines, based on airline name (e.g. Turkish will match Turkish Airlines)
![image](https://github.com/vuilae/finalForWeb/assets/114561182/42314af1-db09-43a1-a281-41e849a04dbb)

## 2. Destinations API - https://rapidapi.com/apiheya/api/sky-scrapper
Returns destinations, based on city. (e.g. Berlin will return hotels, train stations, airports, etc.)
![image](https://github.com/vuilae/finalForWeb/assets/114561182/b359014f-fa29-4d7e-8fe5-4d728edde59a)


## Authorization

The application includes an authorization feature. Middleware functions checks if the user is authorized or not. 
Users needs to authorize to access full functionalities. Used JSON Web Tokens (JWT), cookie-parser for authentication and authorization purposes.

## Admin

- Username: darina
- Password: darina123

## Usage
get('/') - home route where user is redirected, if user is not authorized
get('/admin') - page, where you can choose whether to edit tour or user
get('/tours') - all tours displayed in this route
get('/tours/:id') - details for specific tour, based on id
post('/tours/booking/:id') - to book specific tour
post('/login') - login route, where bcrypt is used for mathcing passwords
post('/register') - bcrypt is used for hashing passwords
post('/destinations') - results from destinations api with map 
post('/airlines') - airlines results with logo
post('/booked') - route for viewing what tours user booked
get('/admin/users') - for CRUD user -> GET, PUT, DELETE, POST with id
get('/admin/tours') - for CRUD tour -> GET, PUT, DELETE, POST with id

## Contributing

- **Bakeyeva Darina | SE-2206**
