-- Revert stackdump:tags_rls_comments from pg

BEGIN;

COMMENT ON COLUMN stackdump.tags.id IS NULL;
COMMENT ON COLUMN stackdump.tags.count IS NULL;

COMMIT;
