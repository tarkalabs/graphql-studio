-- Revert stackdump:comment_triggers from pg

BEGIN;

DROP FUNCTION stackdump_private.inc_commentCount() CASCADE;
DROP FUNCTION stackdump_private.dec_commentCount() CASCADE;

COMMIT;
