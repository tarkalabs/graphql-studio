-- Deploy stackdump:badges to pg
-- requires: appschema
-- requires: users

BEGIN;

CREATE TABLE stackdump.badges(
id SERIAL PRIMARY KEY,
userId INTEGER REFERENCES stackdump.users(id) DEFAULT current_setting('jwt.claims.user_ id',false)::int,
name TEXT NOT NULL,
date TIMESTAMP DEFAULT NOW(),
class INTEGER,
tagBased BOOLEAN
);

CREATE INDEX badges_id_idx ON stackdump.badges(id);
CREATE INDEX badges_userId_idx ON stackdump.badges(userId);

COMMIT;
