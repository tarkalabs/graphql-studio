-- Verify stackdump:authentication on pg

BEGIN;

SELECT has_function_privilege('stackdump.authenticate(TEXT, TEXT)', 'execute');

ROLLBACK;
