-- Revert stackdump:insert_seed_data from pg

BEGIN;

DROP FUNCTION stackdump.insert_seed_account(INTEGER);
DROP FUNCTION stackdump.insert_seed_answer(INTEGER, INTEGER);
DROP FUNCTION stackdump.insert_seed_badge(INTEGER, INTEGER, TEXT, TIMESTAMP, INTEGER, BOOLEAN);
DROP FUNCTION stackdump.insert_seed_comment(INTEGER, INTEGER, INTEGER, TEXT, TIMESTAMP, TEXT, INTEGER, TEXT);
DROP FUNCTION stackdump.insert_seed_post(INTEGER, INTEGER, INTEGER, INTEGER, TIMESTAMP, INTEGER, INTEGER, TEXT, INTEGER, TEXT, INTEGER, TIMESTAMP, TIMESTAMP, TEXT, TEXT[], INTEGER, INTEGER, INTEGER, TIMESTAMP, TIMESTAMP, TEXT);
DROP FUNCTION stackdump.insert_seed_postHistory(INTEGER, INTEGER, INTEGER, TEXT, TIMESTAMP, INTEGER, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION stackdump.insert_seed_postLink(INTEGER, TIMESTAMP, INTEGER, INTEGER, INTEGER);
DROP FUNCTION stackdump.insert_seed_tag(INTEGER, TEXT, INTEGER, INTEGER, INTEGER);
DROP FUNCTION stackdump.insert_seed_user(INTEGER, INTEGER, TIMESTAMP, TEXT, TIMESTAMP, TEXT, TEXT, TEXT, INTEGER, INTEGER, INTEGER, TEXT, INTEGER);
DROP FUNCTION stackdump.insert_seed_vote(INTEGER, INTEGER, INTEGER, INTEGER, TIMESTAMP, INTEGER);

COMMIT;