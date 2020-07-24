-- Revert stackdump:post_view from pg

BEGIN;

DROP VIEW stackdump.post_view;
ALTER TABLE stackdump.posts DROP COLUMN deleted;

COMMIT;
