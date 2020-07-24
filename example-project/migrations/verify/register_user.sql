-- Verify stackdump:register_user on pg
BEGIN;

SELECT has_function_privilege('stackdump.register_user(TEXT, TEXT)', 'execute');

ROLLBACK;