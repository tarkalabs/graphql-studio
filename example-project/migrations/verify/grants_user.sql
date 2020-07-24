-- Verify stackdump:grants_user on pg

BEGIN;

SELECT has_sequence_privilege('user_reg','stackdump.users_id_seq','usage');
SELECT has_sequence_privilege('user_reg','stackdump.users_id_seq','select');
SELECT has_table_privilege('user_reg','stackdump.users','select');
SELECT has_table_privilege('user_reg','stackdump.users','update');
SELECT has_table_privilege('user_reg','stackdump.users','delete');
SELECT has_table_privilege('user_anon','stackdump.users','select');

ROLLBACK;
