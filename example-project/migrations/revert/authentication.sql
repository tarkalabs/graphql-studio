-- Revert stackdump:authentication from pg

BEGIN;

DROP FUNCTION stackdump.authenticate(TEXT,TEXT);

COMMIT;
