-- Deploy stackdump:insert_seed_data to pg
-- requires: appschema
-- requires: accounts
-- requires: badges
-- requires: comments
-- requires: postHistory
-- requires: postLinks
-- requires: posts
-- requires: tags
-- requires: users
-- requires: votes

BEGIN;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_account(
    id INTEGER
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
        INSERT INTO stackdump_private.accounts(id, username, password) VALUES
            (id, CONCAT('SEED_USER', id), extensions.crypt(CONCAT('SEED_PASS', id), extensions.gen_salt('md5')));
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_answer(
    id INTEGER,
    acceptedAnswerId INTEGER
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    UPDATE stackdump.posts SET acceptedAnswerId = $2 WHERE posts.id = $1;
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $2) AND $2 IS NOT NULL) THEN
                $2 := NULL;
                RAISE NOTICE 'Could not update acceptedAnswerId on post with id = (%)', $1;
            END IF;
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_badge(
    id INTEGER,
    userId INTEGER,
    name TEXT,
    date TIMESTAMP,
    class INTEGER,
    tagBased BOOLEAN
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.badges VALUES($1, $2, $3, $4, $5, $6);
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            RAISE NOTICE 'Invalid userId on badge with id = (%)', $1;
            INSERT INTO stackdump.badges VALUES($1, NULL, $3, $4, $5, $6);
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_comment(
    id INTEGER,
    postId INTEGER,
    score INTEGER,
    text TEXT,
    creationDate TIMESTAMP,
    userDisplayName TEXT,
    userId INTEGER,
    contentLicense TEXT
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.comments VALUES($1, $2, $3, $4, $5, $6, $7, $8);
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $2) AND $2 IS NOT NULL) THEN
                $2 := NULL;
                RAISE NOTICE 'Invalid postId on comment with id = (%)', $1;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.users WHERE users.id = $7) AND $7 IS NOT NULL) THEN
                $7 := NULL;
                RAISE NOTICE 'Invalid userId on comment with id = (%)', $1;
            END IF;
            
            INSERT INTO stackdump.comments VALUES($1, $2, $3, $4, $5, $6, $7, $8);
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_post(
    id INTEGER,
    postTypeId INTEGER,
    acceptedAnswerId INTEGER,
    parentId INTEGER,
    creationDate TIMESTAMP,
    score INTEGER,
    viewCount INTEGER,
    body TEXT,
    ownerUserId INTEGER,
    ownerDisplayName TEXT,
    lastEditorUserId INTEGER,
    lastEditDate TIMESTAMP,
    lastActivityDate TIMESTAMP,
    title TEXT,
    tags TEXT[],
    answerCount INTEGER,
    commentCount INTEGER,
    favoriteCount INTEGER,
    closedDate TIMESTAMP,
    communityOwnedDate TIMESTAMP,
    contentLicense TEXT
    
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.posts VALUES($1, $2, NULL, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21);
    EXCEPTION
        WHEN not_null_violation THEN
            RAISE NOTICE 'Caught null body post';
            $8 := 'NO_TEXT';
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.postTypes WHERE postTypes.id = $2) AND $2 IS NOT NULL) THEN
                $2 := NULL;
                RAISE NOTICE 'Invalid postTypeId on post with id = (%)', $1;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.users WHERE users.id = $9) AND $9 IS NOT NULL) THEN
                $9 := NULL;
                RAISE NOTICE 'Invalid OwnerUserId on post with id = (%)', $1;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.users WHERE users.id = $11) AND $11 IS NOT NULL) THEN
                $11 := NULL;
                RAISE NOTICE 'Invalid lastEditorUserId on comment with id = (%)', $1;
            END IF;
            INSERT INTO stackdump.posts VALUES($1, $2, NULL, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21);
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_postHistory(
    id INTEGER,
    postHistoryTypeId INTEGER,
    postId INTEGER,
    revisionGUID TEXT,
    creationDate TIMESTAMP,
    userId INTEGER,
    UserDisplayName TEXT,
    comment TEXT,
    text TEXT,
    contentLicense TEXT
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.postHistory VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.postHistoryTypes WHERE postHistoryTypes.id = $2) AND $2 IS NOT NULL) THEN
                $2 := NULL;
                RAISE NOTICE 'Invalid postHistoryTypeId on post history with id = (%)', id;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $3) AND $3 IS NOT NULL) THEN
                $3 := NULL;
                RAISE NOTICE 'Invalid postId on post history with id = (%)', id;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.users WHERE users.id = $6) AND $6 IS NOT NULL) THEN
                $6 := NULL;
                RAISE NOTICE 'Invalid userId on post history with id = (%)', id;
            END IF;
            INSERT INTO stackdump.postHistory VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_postLink(
    id INTEGER,
    creationDate TIMESTAMP,
    postId INTEGER,
    relatedPostId INTEGER,
    linkTypeId INTEGER
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.postLinks VALUES($1, $2, $3, $4, $5);
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $3) AND $3 IS NOT NULL) THEN
                $3 := NULL;
                RAISE NOTICE 'Invalid postId on post link with id = (%)', $1;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $4) AND $4 IS NOT NULL) THEN
                $4 := NULL;
                RAISE NOTICE 'Invalid relatedPostId on post link with id = (%)', $1;
            END IF;
            INSERT INTO stackdump.postLinks VALUES($1, $2, $3, $4, $5);
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_tag(
    id INTEGER,
    tagName TEXT,
    count INTEGER,
    excerptPostId INTEGER,
    wikiPostId INTEGER
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.tags VALUES($1, $2, $3, $4, $5);
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $4) AND $4 IS NOT NULL) THEN
                $4 := NULL;
                RAISE NOTICE 'Invalid excerptPostId on tag with id = (%)', $1;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $5) AND $5 IS NOT NULL) THEN
                $5 := NULL;
                RAISE NOTICE 'Invalid wikiPostId on tag with id = (%)', $1;
            END IF;
            INSERT INTO stackdump.tags VALUES($1, $2, $3, $4, $5);
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_user(
    id INTEGER,
    reputation INTEGER,
    creationDate TIMESTAMP,
    displayName TEXT,
    lastAccessDate TIMESTAMP,
    websiteUrl TEXT,
    location TEXT,
    aboutMe TEXT,
    views INTEGER,
    upVotes INTEGER,
    downVotes INTEGER,
    profileImageUrl TEXT,
    accountId INTEGER
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $1);
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'caught fk violation in user, check that data was processed properly.';
    END;
$$;

CREATE OR REPLACE FUNCTION stackdump.insert_seed_vote(
    id INTEGER,
    postId INTEGER,
    voteTypeId INTEGER,
    userId INTEGER,
    creationDate TIMESTAMP,
    bountyAmount INTEGER
) RETURNS VOID LANGUAGE PLPGSQL AS $$
    BEGIN
    INSERT INTO stackdump.votes VALUES($1, $2, $3, $4, $5, $6);
    EXCEPTION
        WHEN foreign_key_violation THEN
            RAISE NOTICE 'Caught fk violation: ';
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.posts WHERE posts.id = $2) AND $2 IS NOT NULL) THEN
                $2 := NULL;
                RAISE NOTICE 'Invalid postId on vote with id = (%)', $1;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.voteTypes WHERE voteTypes.id = $3) AND $3 IS NOT NULL) THEN
                $3 := NULL;
                RAISE NOTICE 'Invalid voteTypeId on vote with id = (%)', $1;
            END IF;
            IF (SELECT NOT EXISTS(SELECT 1 FROM stackdump.users WHERE users.id = $4) AND $4 IS NOT NULL) THEN
                $4 := NULL;
                RAISE NOTICE 'Invalid userId on vote with id = (%)', $1;
            END IF;
            INSERT INTO stackdump.votes VALUES($1, $2, $3, $4, $5, $6);
    END;
$$;

COMMIT;
