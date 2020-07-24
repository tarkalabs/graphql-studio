-- Deploy stackdump:register_superuser to pg
-- requires: appschema
-- requires: users
-- requires: accounts
-- requires: roles

BEGIN;

CREATE OR REPLACE FUNCTION stackdump.register_superuser(
    usrname text
) RETURNS VOID AS $$
DECLARE
	num_acc INTEGER;
BEGIN
    SELECT COUNT(*) INTO num_acc FROM stackdump_private.accounts WHERE username = usrname;
    IF num_acc = 1 THEN
        UPDATE stackdump_private.accounts SET role = 'user_super' WHERE username = usrname;
    ELSE
        RAISE EXCEPTION 'User does not exist';
    END IF;
END;
$$ LANGUAGE PLPGSQL STRICT SECURITY DEFINER;

COMMIT;
