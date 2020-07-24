-- Deploy stackdump:votes_before_insert_trigger to pg
-- requires: appschema
-- requires: votes

BEGIN;

CREATE OR REPLACE FUNCTION stackdump_private.check_votes() RETURNS trigger AS $$
DECLARE
    votenum INTEGER;
    usrid INTEGER;
BEGIN
    SELECT COUNT(*) INTO votenum FROM stackdump.votes 
    WHERE postId = NEW.postId AND userId = current_setting('jwt.claims.user_id')::int;
    IF votenum != 0 THEN
        RAISE EXCEPTION 'Duplicate votes not allowed.';
    END IF;
    IF NEW.voteTypeId = 1 THEN
        SELECT owneruserid INTO usrid FROM stackdump.posts WHERE id = (SELECT parentId FROM stackdump.posts WHERE id = NEW.postId);
        IF usrid != current_setting('jwt.claims.user_id')::int THEN
            RAISE EXCEPTION 'Only question owner can vote for answer.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER before_vote_insert BEFORE INSERT ON stackdump.votes FOR EACH ROW EXECUTE PROCEDURE stackdump_private.check_votes(); 

COMMIT;
