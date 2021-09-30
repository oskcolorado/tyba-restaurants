# tyba-ms

Microservice that offers a `API REST` to create and query users.

## Requirements

- NPM    `7.0.3`
- NodeJS `v15.0.1`
- postgresql

## Migrations

Migrations are a way to make database changes or updates, like creating or dropping tables, as well as updating a table with new columns with constraints via generated scripts. We can build these scripts via the command line using knex command line tool.

- Creating migration
```  
$ knex migrate:make <name_migration>
````
- Run migrations
```
$ knex migrate:latest
```
- Rollback migration
```
$ knex migrate:rollback
```

## Build

- Develop installation
```
  1. Download repository.
  2. Run command npm install on project root.
```

- Run locally using `.env.local` or `.env.testing` for set local environment variables

```
  $ export $(cat .env.local | grep -v ^# | xargs)
  $ knex migrate:latest // run migrations
  $ npm run dev
```

- If you want to use docker
```
  $ make api
```

## Auth

This microservice implements two forms of authentication:

- API_KEY

  This way of authenticating is done through a parameter called API_KEY that is sent in the request header. Its use is more oriented to communication with other microservices.

- BEARER TOKEN

  This is an authentication with login in which the credentials of some user are verified in the database and, if correct, a token is generated. This token contains the user information in an encrypted form using the JWT standard. 

## Tests

- Run locally using
```
  $ npm test
```

- If you want to use docker
```
  $ make test
```

## Linter
This microservice use `airbnb` linter

- Run lint to fix syintax problems
```
  $ npm run lint 
```

## License
[MIT](https://choosealicense.com/licenses/mit/)