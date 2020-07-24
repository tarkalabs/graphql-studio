-- Deploy stackdump:users to pg
-- requires: appschema

BEGIN;

CREATE TABLE stackdump.users(
id SERIAL PRIMARY KEY,
reputation INTEGER DEFAULT 1,
creationDate TIMESTAMP DEFAULT NOW(),
displayName TEXT,
lastAccessDate TIMESTAMP DEFAULT NOW(),
websiteUrl TEXT DEFAULT NULL,
location TEXT DEFAULT NULL,
aboutMe TEXT DEFAULT NULL,
views INTEGER DEFAULT 0,
upVotes INTEGER DEFAULT 0,
downVotes INTEGER DEFAULT 0,
profileImageUrl TEXT DEFAULT NULL,
accountId INTEGER NOT NULL REFERENCES stackdump_private.accounts(id)
);

CREATE INDEX users_id_idx ON stackdump.users(id);
CREATE INDEX users_accountId_idx ON stackdump.users(accountId);

COMMIT;
