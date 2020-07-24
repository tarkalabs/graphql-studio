-- Revert stackdump:postHistory from pg

BEGIN;

DROP INDEX stackdump.postHistory_id_idx;
DROP INDEX stackdump.postHistory_postHistoryTypeId_idx;
DROP INDEX stackdump.postHistory_postId_idx;
DROP INDEX stackdump.postHistory_userId_idx;
DROP TABLE stackdump.postHistory;

COMMIT;
