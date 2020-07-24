-- Deploy stackdump:triggers_posts to pg
-- requires: appschema
-- requires: posts

BEGIN;

CREATE OR REPLACE FUNCTION stackdump_private.check_parent() RETURNS trigger AS $$
DECLARE
    pid INTEGER;
BEGIN
    IF NEW.parentId IS NOT NULL THEN
        SELECT parentId INTO pid FROM stackdump.posts WHERE id = (SELECT id FROM stackdump.posts WHERE id = NEW.parentId);
        IF pid IS NOT NULL THEN 
            RAISE EXCEPTION 'Parent post already has a parent';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER before_post_insert BEFORE INSERT ON stackdump.posts FOR EACH ROW EXECUTE PROCEDURE stackdump_private.check_parent(); 

COMMIT;
