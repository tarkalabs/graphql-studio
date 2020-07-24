-- Verify stackdump:grants_votes on pg

BEGIN;

SELECT has_table_privilege('user_anon','stackdump.votes','select');
SELECT has_table_privilege('user_reg','stackdump.users','delete');
SELECT has_table_privilege('user_reg','stackdump.users','insert');
SELECT has_table_privilege('user_reg','stackdump.users','select');
SELECT has_sequence_privilege('user_reg','stackdump.users_id_seq','select');
SELECT has_sequence_privilege('user_reg','stackdump.users_id_seq','usage');

ROLLBACK;
