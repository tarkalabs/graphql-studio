-- Verify stackdump:grants on pg

BEGIN;

SELECT has_function_privilege('user_anon', 'stackdump.register_user(text,text)','execute');
SELECT has_function_privilege('user_anon', 'stackdump.authenticate(text,text)','execute');
SELECT has_schema_privilege('user_anon','stackdump','usage');
SELECT has_schema_privilege('user_reg','stackdump','usage');
SELECT has_schema_privilege('user_reg','extensions','usage');
SELECT has_schema_privilege('user_anon','extensions','usage');
SELECT has_sequence_privilege('user_reg','stackdump.posts_id_seq','usage');
SELECT has_sequence_privilege('user_reg','stackdump.posts_id_seq','select');
SELECT has_table_privilege('user_reg','stackdump.posts','select');
SELECT has_table_privilege('user_reg','stackdump.posts','insert');
SELECT has_table_privilege('user_reg','stackdump.posts','update');
SELECT has_table_privilege('user_reg','stackdump.posts','delete');
SELECT has_function_privilege('user_anon','stackdump.register_superuser(text)','execute');
SELECT has_table_privilege('user_anon','stackdump.posts','select');

ROLLBACK;
