-- Verify stackdump:post_view on pg

BEGIN;

SELECT deleted
    FROM stackdump.posts
    WHERE FALSE;

SELECT * FROM stackdump.post_view;

ROLLBACK;
