-- Revert stackdump:register_superuser from pg

BEGIN;

DROP FUNCTION stackdump.register_superuser(TEXT);

COMMIT;
