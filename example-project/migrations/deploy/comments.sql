-- Deploy stackdump:comments to pg
-- requires: appschema
-- requires: posts
-- requires: users

BEGIN;

CREATE TABLE stackdump.comments(
id SERIAL PRIMARY KEY,
postId INTEGER REFERENCES stackdump.posts(id),
score INTEGER DEFAULT 0,
text TEXT NOT NULL,
creationDate TIMESTAMP DEFAULT NOW(),
userDisplayName TEXT,
userId INTEGER REFERENCES stackdump.users(id) DEFAULT current_setting('jwt.claims.user_id',false)::int,
contentLicense TEXT
);

CREATE INDEX comments_id_idx ON stackdump.comments(id);
CREATE INDEX comments_postId_idx ON stackdump.comments(postId);
CREATE INDEX comments_userId_idx ON stackdump.comments(userId);

COMMIT;
