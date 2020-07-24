-- Verify stackdump:example_badge_triggers on pg

BEGIN;

SELECT has_function_privilege('stackdump_private.autobio_badge()', 'execute');
DO $$
BEGIN
    PERFORM tgname
        FROM pg_trigger
        WHERE NOT tgisinternal AND tgname = 'autobio_check';
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Trigger not found';
        END IF;
END $$;

ROLLBACK;
