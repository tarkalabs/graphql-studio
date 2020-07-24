-- Verify stackdump:accounts on pg

BEGIN;

SELECT id, username
    FROM stackdump_private.accounts
    WHERE FALSE;

ROLLBACK;
