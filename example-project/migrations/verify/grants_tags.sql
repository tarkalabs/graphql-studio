-- Verify stackdump:grants_tgs on pg

BEGIN;

SELECT has_table_privilege('user_reg','stackdump.tags','select');
SELECT has_table_privilege('user_anon','stackdump.tags','select');

ROLLBACK;
