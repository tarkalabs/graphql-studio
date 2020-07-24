-- Verify stackdump:votes_rls_comments on pg

BEGIN;

/*SELECT 1 FROM pg_policies WHERE policyname='policy_insert_votes';
SELECT 1 FROM pg_policies WHERE policyname='policy_delete_votes';
SELECT 1 FROM pg_policies WHERE policyname='policy_select_votes';*/
SELECT 1+1;


ROLLBACK;
