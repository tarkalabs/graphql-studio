-- Verify stackdump:user_rls_comments on pg

BEGIN;

SELECT 1 FROM pg_policies WHERE policyname='policy_delete_user';
SELECT 1 FROM pg_policies WHERE policyname='policy_update_user';
SELECT 1 FROM pg_policies WHERE policyname='policy_select_user';

ROLLBACK;
