-- Verify stackdump:jwt on pg

BEGIN;

SELECT 1 FROM pg_type WHERE typname='jwt_token';

COMMIT;