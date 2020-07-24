-- Deploy stackdump:grants_comments to pg
-- requires: comments
-- requires: appschema
-- requires: roles

BEGIN;

GRANT insert,select,update,delete ON TABLE stackdump.comments TO user_reg;
GRANT select ON TABLE stackdump.comments TO user_anon;
GRANT usage,select ON SEQUENCE stackdump.comments_id_seq TO user_reg;

COMMIT;
