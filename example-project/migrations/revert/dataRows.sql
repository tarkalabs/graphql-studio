-- Revert stackdump:dataRows from pg

BEGIN;

TRUNCATE stackdump.votes CASCADE;
TRUNCATE stackdump.postHistory CASCADE;
TRUNCATE stackdump.tags CASCADE;
TRUNCATE stackdump.comments CASCADE;
TRUNCATE stackdump.postLinks CASCADE;
TRUNCATE stackdump.posts CASCADE;
TRUNCATE stackdump.badges CASCADE;
TRUNCATE stackdump.users CASCADE;

COMMIT;
