-- Deploy stackdump:comment_triggers to pg
-- requires: appschema
-- requires: comments

BEGIN;

CREATE FUNCTION stackdump_private.inc_commentCount() RETURNS TRIGGER AS $$
    BEGIN
        UPDATE stackdump.posts SET commentCount = commentCount + 1
            WHERE posts.id = new.postId;
        RETURN new;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER comment_count_increment AFTER INSERT
    ON stackdump.comments
    FOR EACH ROW
    EXECUTE PROCEDURE stackdump_private.inc_commentCount();

CREATE FUNCTION stackdump_private.dec_commentCount() RETURNS TRIGGER AS $$
    BEGIN
        UPDATE stackdump.posts SET commentCount = commentCount - 1
            WHERE posts.id = old.postId;
        RETURN old;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER comment_count_decrement BEFORE DELETE
    ON stackdump.comments
    FOR EACH ROW
    EXECUTE PROCEDURE stackdump_private.dec_commentCount();

COMMIT;
