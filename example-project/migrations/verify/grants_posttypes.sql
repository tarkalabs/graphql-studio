-- Verify stackdump:grants_posttypes on pg

BEGIN;


SELECT has_table_privilege('user_reg','stackdump.posttypes','select');
SELECT has_table_privilege('user_anon','stackdump.posttypes','select');

ROLLBACK;
