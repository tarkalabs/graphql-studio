-- Deploy stackdump:tags to pg
-- requires: appschema
-- requires: posts

BEGIN;

CREATE TABLE stackdump.tags(
id SERIAL PRIMARY KEY,
tagName TEXT NOT NULL,
count INTEGER DEFAULT 0,
excerptPostId INTEGER REFERENCES stackdump.posts(id),
wikiPostId INTEGER REFERENCES stackdump.posts(id)
);

CREATE INDEX tags_id_idx ON stackdump.tags(id);
CREATE INDEX tags_excerptPostId_idx ON stackdump.tags(excerptPostId);
CREATE INDEX tags_wikiPostId_idx ON stackdump.tags(wikiPostId);

COMMIT;
