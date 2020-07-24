-- Revert stackdump:posts from pg

BEGIN;

DROP INDEX stackdump.posts_id_idx;
DROP INDEX stackdump.posts_PostTypeId_idx;
DROP INDEX stackdump.posts_acceptedAnswerId_idx;
DROP INDEX stackdump.posts_parentId_idx;
DROP INDEX stackdump.posts_ownerUserId_idx;
DROP INDEX stackdump.posts_lastEditorUserId_idx;
DROP TABLE stackdump.posts;

COMMIT;
