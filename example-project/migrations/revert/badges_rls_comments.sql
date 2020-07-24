-- Revert stackdump:badges_rls_comments from pg

BEGIN;

COMMENT ON COLUMN stackdump.badges.id IS NULL;
COMMENT ON COLUMN stackdump.badges.userId IS NULL;
COMMENT ON COLUMN stackdump.badges.date IS NULL;

COMMIT;
