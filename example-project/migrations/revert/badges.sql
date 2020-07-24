-- Revert stackdump:badges from pg

BEGIN;

DROP INDEX stackdump.badges_id_idx;
DROP INDEX stackdump.badges_userId_idx;
DROP TABLE stackdump.badges;

COMMIT;
