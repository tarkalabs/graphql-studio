-- Deploy stackdump:authentication to pg
-- requires: jwt
-- requires: accounts
-- requires: users

BEGIN;

CREATE OR REPLACE FUNCTION stackdump.authenticate(
    username text,
    password text
) RETURNS stackdump.jwt_token AS $$
DECLARE
    account stackdump_private.accounts;
    num INTEGER;
    userid INTEGER;
BEGIN
    SELECT COUNT(*) INTO num FROM stackdump_private.accounts 
    WHERE accounts.username = $1 AND accounts.password = extensions.crypt($2, accounts.password);
	IF num = 1 THEN
		SELECT * INTO account FROM stackdump_private.accounts 
    	WHERE accounts.username = $1 AND accounts.password = extensions.crypt($2, accounts.password);
        UPDATE stackdump.users SET lastaccessdate = now() WHERE accountId = account.id;
        SELECT id INTO userid FROM stackdump.users WHERE accountId = account.id;
        RETURN (account.role, userid, account.username, extract(epoch from now() + interval '7 days'))::stackdump.jwt_token;
	ELSE
		RAISE EXCEPTION 'User does not exist'; 
	END IF;
END;
$$ language PLPGSQL STRICT SECURITY DEFINER;

COMMIT;
