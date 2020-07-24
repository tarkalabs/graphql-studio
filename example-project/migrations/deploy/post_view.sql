-- Deploy stackdump:post_view to pg
-- requires: appschema
-- requires: posts

BEGIN;

ALTER TABLE stackdump.posts ADD COLUMN deleted BOOLEAN DEFAULT false;
UPDATE stackdump.posts SET deleted = false;

CREATE VIEW stackdump.post_view AS
    (SELECT id,
            postTypeId,
            acceptedAnswerId,
            parentId,
            creationDate,
            score,
            viewCount,
            body,
            ownerUserId,
            ownerDisplayName,
            lastEditorUserId,
            lastEditDate,
            lastActivityDate,
            title,
            tags,
            answerCount,
            commentCount,
            favoriteCount,
            closedDate,
            communityOwnedDate,
            contentLicense
        FROM stackdump.posts WHERE deleted = false);

COMMIT;
