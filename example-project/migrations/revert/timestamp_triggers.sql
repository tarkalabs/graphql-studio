-- Revert stackdump:timestamp_triggers from pg

BEGIN;

DROP FUNCTION stackdump_private.set_lastEditDate() CASCADE;
DROP FUNCTION stackdump_private.set_lastActivityDate() CASCADE;

COMMIT;
