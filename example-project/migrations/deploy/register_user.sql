-- Deploy stackdump:register_user to pg
-- requires: appschema
-- requires: accounts
-- requires: users

BEGIN;

CREATE OR REPLACE FUNCTION stackdump.register_user(
    username text,
    password text
) RETURNS stackdump.users AS $$
DECLARE
	usr stackdump.users;
	usr_account stackdump_private.accounts;
BEGIN
    INSERT INTO stackdump_private.accounts (username, password) VALUES ($1, extensions.crypt($2, extensions.gen_salt('bf'))) RETURNING * INTO usr_account;
    INSERT INTO stackdump.users (displayName, accountId) VALUES (username, usr_account.id) RETURNING * INTO usr;
    RETURN usr;
END;
$$ LANGUAGE PLPGSQL STRICT SECURITY DEFINER;

COMMIT;
