-- Deploy stackdump:roles to pg

BEGIN;

CREATE ROLE user_anon;
CREATE ROLE user_reg;
CREATE ROLE user_super WITH SUPERUSER;

COMMIT;
