-- Verify stackdump:insert_seed_data on pg

BEGIN;

SELECT has_function_privilege('stackdump.insert_seed_account(INTEGER)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_answer(INTEGER, INTEGER)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_badge(INTEGER, INTEGER, TEXT, TIMESTAMP, INTEGER, BOOLEAN)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_comment(INTEGER, INTEGER, INTEGER, TEXT, TIMESTAMP, TEXT, INTEGER, TEXT)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_post(INTEGER, INTEGER, INTEGER, INTEGER, TIMESTAMP, INTEGER, INTEGER, TEXT, INTEGER, TEXT, INTEGER, TIMESTAMP, TIMESTAMP, TEXT, TEXT[], INTEGER, INTEGER, INTEGER, TIMESTAMP, TIMESTAMP, TEXT)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_postHistory(INTEGER, INTEGER, INTEGER, TEXT, TIMESTAMP, INTEGER, TEXT, TEXT, TEXT, TEXT)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_postLink(INTEGER, TIMESTAMP, INTEGER, INTEGER, INTEGER)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_tag(INTEGER, TEXT, INTEGER, INTEGER, INTEGER)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_user(INTEGER, INTEGER, TIMESTAMP, TEXT, TIMESTAMP, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, TEXT, INTEGER)', 'execute');
SELECT has_function_privilege('stackdump.insert_seed_vote(INTEGER, INTEGER, INTEGER, INTEGER, TIMESTAMP, INTEGER)', 'execute');

ROLLBACK;
