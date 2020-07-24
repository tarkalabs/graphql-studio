-- Verify stackdump:comment_triggers on pg

BEGIN;

SELECT has_function_privilege('stackdump_private.inc_commentCount()', 'execute');
SELECT has_function_privilege('stackdump_private.dec_commentCount()', 'execute');

DO $$
BEGIN
    PERFORM tgname
        FROM pg_trigger
        WHERE NOT tgisinternal AND tgname = 'comment_count_increment';
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Trigger not found';
        END IF;
END $$;

DO $$
BEGIN
    PERFORM tgname
        FROM pg_trigger
        WHERE NOT tgisinternal AND tgname = 'comment_count_decrement';
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Trigger not found';
        END IF;
END $$;

ROLLBACK;
