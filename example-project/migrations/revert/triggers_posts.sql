-- Revert stackdump:triggers_posts from pg

BEGIN;

DROP TRIGGER IF EXISTS before_post_insert ON stackdump.posts;
DROP FUNCTION IF EXISTS stackdump_private.check_parent();

COMMIT;
