-- Revert stackdump:text_search from pg

BEGIN;

DROP INDEX stackdump.posts_textsearch_idx;
ALTER TABLE stackdump.posts DROP COLUMN textsearch_index_col;
DROP FUNCTION stackdump_private.posts_tsvector_trigger() CASCADE;
DROP FUNCTION stackdump.ranked_search(TEXT);

COMMIT;
