-- Revert stackdump:postLinks from pg

BEGIN;

DROP INDEX stackdump.postLinks_id_idx;
DROP INDEX stackdump.postLinks_postId_idx;
DROP INDEX stackdump.postLinks_relatedPostId_idx;
DROP TABLE stackdump.postlinks;

COMMIT;
