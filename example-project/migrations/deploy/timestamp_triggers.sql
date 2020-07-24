-- Deploy stackdump:timestamp_triggers to pg
-- requires: posts
-- requires: users
-- requires: appschema

BEGIN;

CREATE FUNCTION stackdump_private.set_lastEditDate() RETURNS TRIGGER AS $$
    BEGIN
        new.lastEditDate := NOW();
        RETURN new;
    END;
$$ LANGUAGE PLPGSQL;

CREATE FUNCTION stackdump_private.set_lastActivityDate() RETURNS TRIGGER AS $$
    BEGIN
        new.lastActivityDate := NOW();
        RETURN new;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER post_edited_at BEFORE UPDATE
    OF body ON stackdump.posts
    FOR EACH ROW
    EXECUTE PROCEDURE stackdump_private.set_LastEditDate();

CREATE TRIGGER post_activity_at BEFORE UPDATE
    OF answerCount, commentCount ON stackdump.posts
    FOR EACH ROW
    EXECUTE PROCEDURE stackdump_private.set_LastActivityDate();

COMMIT;
