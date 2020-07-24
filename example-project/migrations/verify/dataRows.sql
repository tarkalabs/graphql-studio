-- Verify stackdump:dataRows on pg

BEGIN;

SELECT 1/COUNT(*) FROM stackdump.users;
SELECT 1/COUNT(*) FROM stackdump.badges;
SELECT 1/COUNT(*) FROM stackdump.posts;
SELECT 1/COUNT(*) FROM stackdump.comments;
SELECT 1/COUNT(*) FROM stackdump.tags;
SELECT 1/COUNT(*) FROM stackdump.postHistory;
SELECT 1/COUNT(*) FROM stackdump.votes;

ROLLBACK;
