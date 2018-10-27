# Assignment: Rate Limit

[![Build Status](https://travis-ci.org/JustinTW/assignment-rate-limit.svg?branch=master)](https://travis-ci.org/JustinTW/assignment-rate-limit)
[![Coverage Status](https://coveralls.io/repos/JustinTW/assignment-rate-limit/badge.svg?branch=master)](https://coveralls.io/r/JustinTW/assignment-rate-limit?branch=master)

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

- method 1: using docker-compose

```
docker-compose up -d
docker exec -it web bash
```

- method 2: using GUN Makefile

```
make up
make at
```

### Install dependencies

```
yarn
```

### Run Test

```
yarn test
```

### Run Apps

```
yarn start
```

After service start, you can open your web app in a browser via: http://localhost:3000

## Stack

- Express@4.16.3
- Redis
- Mocha@4.0.1

## Reference

- generator-express: https://github.com/petecoop/generator-express
- express middleware: https://expressjs.com/zh-tw/guide/writing-middleware.html
