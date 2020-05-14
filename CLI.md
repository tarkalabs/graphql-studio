# GraphQL Studio CLI

## Generator

### Create a project

This should create the new folder for a project. It will setup a Dockerfile and docker-compose.yml for the database and postgraphile container. It will also setup a sample express js app that will use postgraphile as a middleware. It will setup the migrations directory with sqitch. The generator will also setup a test infrastructure as well.

```
gqlstudio new my-app
```

```
my-app
| app/
| | server.js
| | extensions/
| migrations
| | sqitch.conf
| | sqitch.plan
| | deploy/
| | | schema.sql --> # creates app and app_private schemas
| | | tables/
| | | functions/
| | | | set_timestamps.sql
| | | policies/
| | revert/
| | verify/
| | test/
| | | setup.js # --> Setup postgraphile connection for test environment
| | | example_test.js # --> an example mocha test
| package.json
| roles.json # -> document
| Dockerfile
| docker-compose.yml
```

### Creating a table

This should create the necessary schema for database tables. 

```
gqlstudio gen table <table> [--requires <other_table>]
```

```
my-app
| ...
| migrations
| | ...
| | deploy/
| | | ...
| | | tables/
| | | | <table>/
| | | | | structure.sql # -> should have create table, creates triggers for created
                        #    for created_at and updated_at
| | | functions/
| | | | ...
| | | policies/
| | | | <table>/
| | | | | public_read.sql # -> Enable row level security and allow all roles to select
| | revert/
| | | ... same structure as deploy
| | verify/
| | | ... same structure as deploy
| | test/
| | | setup.js # --> Setup postgraphile connection for test environment
| | | <table>/
| | | | example_gql_test_with_connection.js
| | | example_test.js # --> an example mocha test
```

### Customize a table with SQL function

This generates a SQL function that will extend on the type

```
gqlstudio gen extension <name> --for <table> --type sql
```

```
my-app
| migrations
| | deploy/
| | | tables/
| | | functions/
| | | | <table>/
| | | | | <name>.sql # --> create function <table>_<name>
                     # Also generate commented grant statements for roles
| | revert/
| | | ... same as deploy
| | verify/
| | | ... same as deploy
| | test/
| | | setup.js # --> Setup postgraphile connection for test environment
| | | example_test.js # --> an example mocha test
| | | <table>/
| | | | ...
| | | | <table>_<extension_name>_test.js
```