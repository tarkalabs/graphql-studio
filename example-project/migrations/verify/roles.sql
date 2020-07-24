-- Verify stackdump:roles on pg

BEGIN;

SELECT 1 FROM pg_roles WHERE rolname='user_anon';
SELECT 1 FROM pg_roles WHERE rolname='user_reg';
SELECT 1 FROM pg_roles WHERE rolname='user_super';

ROLLBACK;
