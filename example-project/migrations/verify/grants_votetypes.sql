-- Verify stackdump:grants_votetypes on pg

BEGIN;

SELECT has_table_privilege('user_reg','stackdump.votetypes','select');
SELECT has_table_privilege('user_anon','stackdump.votetypes','select');

ROLLBACK;
