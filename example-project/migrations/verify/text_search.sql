-- Verify stackdump:text_search on pg

BEGIN;

SELECT textsearch_index_col
    FROM stackdump.posts
    WHERE FALSE;

SELECT has_function_privilege('stackdump_private.posts_tsvector_trigger()', 'execute');
SELECT has_function_privilege('stackdump.ranked_search(TEXT)', 'execute');


DO $$
BEGIN
    PERFORM tgname
        FROM pg_trigger
        WHERE NOT tgisinternal AND tgname = 'tsvectorupdate';
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Trigger not found';
        END IF;
END $$;

ROLLBACK;
