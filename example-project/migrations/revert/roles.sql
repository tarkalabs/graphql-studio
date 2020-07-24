-- Revert stackdump:roles from pg

BEGIN;

DROP ROLE user_anon;
DROP ROLE user_reg;
DROP ROLE user_super;

COMMIT;
