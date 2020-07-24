-- Verify stackdump:triggers_posts on pg

BEGIN;

SELECT * FROM pg_trigger WHERE tgname='before_post_insert';

ROLLBACK;
