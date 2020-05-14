-- Revert example:appschema from pg

BEGIN;

DROP SCHEMA dvdrental

COMMIT;
