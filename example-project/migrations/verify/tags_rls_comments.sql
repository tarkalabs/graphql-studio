-- Verify stackdump:tags_rls_comments on pg

BEGIN;

SELECT 1 + 1;

ROLLBACK;
