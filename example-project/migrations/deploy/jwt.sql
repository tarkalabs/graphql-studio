-- Deploy stackdump:jwt to pg

BEGIN;

CREATE TYPE stackdump.jwt_token AS(
    role TEXT,
    user_id INTEGER,
    username TEXT,
    exp INTEGER
);

COMMIT;