-- Revert stackdump:post_triggers from pg

BEGIN;

DROP FUNCTION stackdump_private.post_create_trigger() CASCADE;
DROP FUNCTION stackdump_private.post_delete_trigger() CASCADE;

COMMIT;
