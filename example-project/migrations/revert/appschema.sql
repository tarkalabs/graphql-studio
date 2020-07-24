-- Revert stackdump:appschema from pg

BEGIN;

DROP EXTENSION IF EXISTS "pgcrypto";
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP SCHEMA IF EXISTS stackdump CASCADE;
DROP SCHEMA IF EXISTS stackdump_private CASCADE;
DROP SCHEMA IF EXISTS extensions CASCADE;

COMMIT;
