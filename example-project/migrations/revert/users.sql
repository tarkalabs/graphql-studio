-- Revert stackdump:users from pg

BEGIN;

DROP INDEX stackdump.users_id_idx;
DROP INDEX stackdump.users_accountId_idx;
DROP TABLE stackdump.users;

COMMIT;
