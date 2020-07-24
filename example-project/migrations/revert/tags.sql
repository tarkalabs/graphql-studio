-- Revert stackdump:tags from pg

BEGIN;

DROP INDEX stackdump.tags_id_idx;
DROP INDEX stackdump.tags_excerptPostId_idx;
DROP INDEX stackdump.tags_wikiPostId_idx;
DROP TABLE stackdump.tags;

COMMIT;
