-- Revert stackdump:comments from pg

BEGIN;

DROP INDEX stackdump.comments_id_idx;
DROP INDEX stackdump.comments_postId_idx;
DROP INDEX stackdump.comments_userId_idx;
DROP TABLE stackdump.comments;

COMMIT;
