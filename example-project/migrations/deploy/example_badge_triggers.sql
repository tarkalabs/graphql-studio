-- Deploy stackdump:example_badge_triggers to pg
-- requires: badges
-- requires: users
-- requires: appschema

BEGIN;

CREATE FUNCTION stackdump_private.autobio_badge() RETURNS TRIGGER AS $$
    BEGIN
        IF old.aboutMe IS NULL AND 
        ((SELECT COUNT(*) FROM stackdump.badges WHERE badges.userId = old.id AND badges.name = 'Autobiographer') = 0) THEN
            RAISE NOTICE 'TEST';
            PERFORM stackdump.insert_badge((nextval('stackdump.badges_id_seq'))::INTEGER, old.id, 'Autobiographer'::TEXT, NOW()::TIMESTAMP, 3, FALSE);
        END IF;
        RETURN new;
    END;
$$ LANGUAGE PLPGSQL;

CREATE TRIGGER autobio_check BEFORE UPDATE
    OF aboutMe ON stackdump.users
    FOR EACH ROW
    EXECUTE PROCEDURE stackdump_private.autobio_badge();

COMMIT;
