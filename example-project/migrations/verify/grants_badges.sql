-- Verify stackdump:grants_badges on pg

BEGIN;

SELECT has_table_privilege('user_reg','stackdump.badges','select');
SELECT has_table_privilege('user_anon','stackdump.badges','select');

ROLLBACK;
