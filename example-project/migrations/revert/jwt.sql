-- Revert stackdump:jwt_type from pg

BEGIN;

DROP TYPE stackdump.jwt_token;

COMMIT;