-- Deploy stackdump:postHistory to pg
-- requires: appschema
-- requires: users
-- requires: posts
-- requires: postHistoryTypes

BEGIN;

CREATE TABLE stackdump.posthistory(
id SERIAL PRIMARY KEY,
postHistoryTypeId INTEGER REFERENCES stackdump.postHistoryTypes(id),
postId INTEGER REFERENCES stackdump.posts(id),
revisionGUID TEXT,
creationDate TIMESTAMP DEFAULT NOW(),
userId INTEGER REFERENCES stackdump.users(id),
UserDisplayName TEXT,
comment TEXT,
text TEXT,
contentLicense TEXT
);

CREATE INDEX postHistory_id_idx ON stackdump.postHistory(id);
CREATE INDEX postHistory_postHistoryTypeId_idx ON stackdump.postHistory(postHistoryTypeId);
CREATE INDEX postHistory_postId_idx ON stackdump.postHistory(postId);
CREATE INDEX postHistory_userId_idx ON stackdump.postHistory(userId);

COMMIT;
