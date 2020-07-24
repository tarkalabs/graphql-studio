-- Verify stackdump:timestamp_triggers on pg

BEGIN;

SELECT has_function_privilege('stackdump_private.set_lastEditDate()', 'execute');
SELECT has_function_privilege('stackdump_private.set_lastActivityDate()', 'execute');

DO $$
BEGIN
    PERFORM tgname
        FROM pg_trigger
        WHERE NOT tgisinternal AND tgname = 'post_edited_at';
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Trigger not found';
        END IF;
END $$;

DO $$
BEGIN
    PERFORM tgname
        FROM pg_trigger
        WHERE NOT tgisinternal AND tgname = 'post_activity_at';
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Trigger not found';
        END IF;
END $$;

ROLLBACK;
