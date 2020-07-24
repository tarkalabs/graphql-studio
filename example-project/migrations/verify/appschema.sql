-- Verify stackdump:appschema on pg

BEGIN;

SELECT pg_catalog.has_schema_privilege('stackdump', 'usage');
SELECT pg_catalog.has_schema_privilege('stackdump_private', 'usage');
SELECT pg_catalog.has_schema_privilege('extensions', 'usage');

ROLLBACK;
