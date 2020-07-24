-- Verify stackdump:posts_rls_comments on pg

BEGIN;

SELECT 1 FROM pg_policies WHERE policyname='policy_insert_posts';
SELECT 1 FROM pg_policies WHERE policyname='policy_delete_posts';
SELECT 1 FROM pg_policies WHERE policyname='policy_update_posts';
SELECT 1 FROM pg_policies WHERE policyname='policy_select_posts';

ROLLBACK;
