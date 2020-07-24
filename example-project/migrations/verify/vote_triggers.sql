-- Verify stackdump:vote_triggers on pg

BEGIN;

SELECT has_function_privilege('stackdump_private.vote_create_trigger()', 'execute');
SELECT has_function_privilege('stackdump_private.vote_delete_trigger()', 'execute');

ROLLBACK;
