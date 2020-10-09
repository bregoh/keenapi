# KEEN API

This a basic API which adds Authors and Book information. Every book is linked to an Author by reference. The primary storage for this API is MongoDB for data and Node-Cache for caching

# Usage

`git pull`
or
`git clone`
then
`npm install`
set environmental variables

- MONGO_URI
- JWT_SK
- MongoDB_DATABASE
- NODE_ENV
  run the app `npm start` || `nodemon start`

# Docker installation

- Install mongodb image if not available
- Skip MongoDB installation if you plan to use MongoDB Atlas
- Create a volume for MongoDB `docker volume create mongodb`
- Create a volume for MongoDB config `docker volume create mongodb_config`
- Create a network for MongoDB `docker network create mongodb`
- Download, Install and Run MongoDB image `docker run -it --rm -d -v mongodb:/data/db -v mongodb_config:/data/configdb -p 27017:27017 --network mongodb --name mongodb mongo`
- You can also clone this repository and build the docker image locally using the docker file in the repository
- Pull the image `docker pull bregoh/keenapi:ke2020`
- Build the image `docker build -t bregoh/keenapi:ke2020`
- Run the docker container `docker run -it --rm -d --network mongodb -p 4001:4001 -d bregoh/keenapi:ke2020`

# Entry Point on heroku

[Entry](http://test.bregoh.com)

# API Documentation

[Docs](http://test.bregoh.com/docs)
