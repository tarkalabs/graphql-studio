-- Revert stackdump:example_badge_triggers from pg

BEGIN;

DROP FUNCTION stackdump_private.autobio_badge() CASCADE;

COMMIT;
