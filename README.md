# Assignment: Rate Limit Demo

[![Build Status](https://travis-ci.org/JustinTW/assignment-rate-limit.svg?branch=master)](https://travis-ci.org/JustinTW/assignment-rate-limit)
[![Coverage Status](https://coveralls.io/repos/JustinTW/assignment-rate-limit/badge.svg?branch=master)](https://coveralls.io/r/JustinTW/assignment-rate-limit?branch=master)

An implementation of rate limit on Express framework using **token bucket** algorithms backed by **Redis** database.

## Screenshot

![Screenshot](/docs/screenshot.png?raw=true 'Rate Limit Demo Screenshot')

## Requirement

- Docker >= 18.06.1-ce
- Docker Compose >= 1.21.0
- GUN Make >= 4.1 (Optional)

## Quick start

### Clone repository

```
git clone https://github.com/JustinTW/assignment-rate-limit.git
cd assignment-rate-limit
```

### Boot up and attach develop environment

- Method 1: docker and docker-compose

```
# create docker network
docker network create assignment-rate-limit

# boot up redis and web container
env $(cat .env/deploy.env .env/config.env | grep -v ^# | xargs) \
  docker-compose -f docker-compose.yml up --build -d

# attach to web container
docker exec -it web bash
```

- Method 2 (recommand): makefile

```
# boot up redis and web container
make up

# attach web container
make at
```

### Install dependencies

```
# make sure you are in ./src directory
yarn
```

### Run Apps

```
# make sure you are in ./src directory and redis:6379 is reachable
yarn start
```

After service start, you can open your web app in a browser via: http://localhost:3000

### Run Test

```
# make sure you are in ./src directory
yarn test:coverage
```

### Clean environment

- Method 1: docker command

```
docker kill redis web; docker rm redis web
docker rmi redis web
docker network rm assignment-rate-limit
```

- Method 2: makefile

```
make stop
```

## Stack

- Express@4.16.3
- Redis Server@5.0.0
- Mocha@4.0.1

## Reference

- generator-express: https://github.com/petecoop/generator-express
- express middleware: https://expressjs.com/zh-tw/guide/writing-middleware.html
- Redis Commands: https://redis.io/commands
