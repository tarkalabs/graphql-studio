-- Deploy stackdump:tags_rls_comments to pg
-- requires: appschema
-- requires: tags
-- requires: roles

BEGIN;

COMMENT ON COLUMN stackdump.tags.id IS E'@omit create,update';
COMMENT ON COLUMN stackdump.tags.count IS E'@omit create,update';

COMMIT;
