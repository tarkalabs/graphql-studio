-- Deploy stackdump:accounts to pg
-- requires: appschema

BEGIN;

CREATE TABLE stackdump_private.accounts(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user_reg',
    creationDate TIMESTAMP DEFAULT NOW()
);

CREATE INDEX accounts_id_idx ON stackdump_private.accounts(id);

COMMIT;
