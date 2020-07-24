-- Verify stackdump:register_superuser on pg

BEGIN;

SELECT has_function_privilege('stackdump.register_superuser(TEXT)', 'execute');

ROLLBACK;
