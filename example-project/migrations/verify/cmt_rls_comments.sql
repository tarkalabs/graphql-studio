-- Verify stackdump:cmt_rls_comments on pg

BEGIN;

SELECT 1 FROM pg_policies WHERE policyname='policy_insert_comments';
SELECT 1 FROM pg_policies WHERE policyname='policy_delete_comments';
SELECT 1 FROM pg_policies WHERE policyname='policy_update_comments';
SELECT 1 FROM pg_policies WHERE policyname='policy_select_comments';

ROLLBACK;
