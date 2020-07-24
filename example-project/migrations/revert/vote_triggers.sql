-- Revert stackdump:vote_triggers from pg

BEGIN;

DROP FUNCTION stackdump_private.vote_create_trigger() CASCADE;
DROP FUNCTION stackdump_private.vote_delete_trigger() CASCADE;

COMMIT;
