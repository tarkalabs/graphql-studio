-- Revert stackdump:grants_tgs from pg

BEGIN;

REVOKE select ON TABLE stackdump.tags FROM user_anon, user_reg;

COMMIT;
