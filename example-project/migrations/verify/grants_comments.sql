-- Verify stackdump:grants_comments on pg

BEGIN;

SELECT has_table_privilege('user_reg','stackdump.comments','select');
SELECT has_table_privilege('user_reg','stackdump.comments','insert');
SELECT has_table_privilege('user_reg','stackdump.comments','update');
SELECT has_table_privilege('user_reg','stackdump.comments','delete');
SELECT has_table_privilege('user_anon','stackdump.comments','select');
SELECT has_sequence_privilege('user_reg','stackdump.comments_id_seq','usage');
SELECT has_sequence_privilege('user_reg','stackdump.comments_id_seq','select');

ROLLBACK;
