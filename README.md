# Task managment api

## Hurl
To run:
```
hurl --test users-endpoints.hurl
hurl --test tasks-endpoints.hurl
hurl --test comments-endpoints.hurl
```
All of them:
```
hurl --test *.hurl
```

# Tips
The dir `db/entities` should be called `db/orm` like in nu is called `wire.datomic` to include the entities for the db.

# Prompt used to generate this in claude
