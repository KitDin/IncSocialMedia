CREATE TABLE __USER(
    USER_ID VARCHAR(200) PRIMARY KEY,
    USER_ACCOUNTNAME VARCHAR(16) UNIQUE NOT NULL,
    USER_EMAIL VARCHAR(200) UNIQUE NOT NULL,
    USER_PASSWORD CHAR(10) NOT NULL,
    USER_CREATEAT DATE,
    USER_UPDATEAT DATE
);

CREATE TABLE __USER_INFOR(
    USER_ID VARCHAR(200) PRIMARY KEY,
    USER_FIRSTNAME VARCHAR(15) NOT NULL,
    USER_SUBNAME VARCHAR(15) NOT NULL,
    USER_NICKNAME VARCHAR(15) NOT NULL,
    USER_NUMBERPHONE CHAR(10),
    USER_AVATARURL VARCHAR(250),
    USER_COVER VARCHAR(250),
    USER_STATUS ENUM('Online', 'Offline', 'Block') DEFAULT 'Online',
    USER_BRITHDAY DATE,
    FOREIGN KEY (USER_ID) REFERENCES __USER(USER_ID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE __FRIEND_SHIP(
    FS_ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_ID1 VARCHAR(200),
    USER_ID2 VARCHAR(200),
    FS_CREATEAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (USER_ID1) REFERENCES __USER(USER_ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_ID2) REFERENCES __USER(USER_ID) ON DELETE CASCADE
);

CREATE TABLE __FRIEND_REQUEST(
    FR_ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_SENDERID VARCHAR(200),
    USER_RECID VARCHAR(200),
    FR_STATUSREQ ENUM('accept', 'pend', 'def') DEFAULT 'pend',
    FR_CREATEAT DATETIME DEFAULT NOW(),
    FOREIGN KEY (USER_SENDERID) REFERENCES __USER(USER_ID) ON DELETE CASCADE,
    FOREIGN KEY (USER_RECID) REFERENCES __USER(USER_ID) ON DELETE CASCADE
);

-- CREATE TABLE __FOLLOWER(
--     F_ID INT AUTO_INCREMENT PRIMARY KEY,
--     USER_FOLLOWERID VARCHAR(200),
--     USER_FOLLINGID VARCHAR(200),
--     FOREIGN KEY (USER_FOLLOWERID) REFERENCES __USER(USER_ID) ON DELETE CASCADE,
--     FOREIGN KEY (USER_FOLLINGID) REFERENCES __USER(USER_ID) ON DELETE CASCADE
-- );

CREATE TABLE __POSTS(
    POST_ID VARCHAR(200) PRIMARY KEY,
    USER_ID VARCHAR(200),
    POST_CONTENT VARCHAR(2000),
    POST_ACCESSMODIFIES ENUM('Private', 'Public', 'Friends Only', 'Custom'),
    POST_TIME DATETIME,
    FOREIGN KEY (USER_ID) REFERENCES __USER(USER_ID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE __IMGS_POST(
    POST_ID VARCHAR(200),
    POST_IMGURL VARCHAR(200),
    FOREIGN KEY (POST_ID) REFERENCES __POSTS(POST_ID) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (POST_ID, POST_IMGURL)
);

CREATE TABLE __LIKES(
    USER_ID VARCHAR(200),
    POST_ID VARCHAR(200),
    PRIMARY KEY(USER_ID, POST_ID),
    FOREIGN KEY(USER_ID) REFERENCES __USER(USER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(POST_ID) REFERENCES __POSTS(POST_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE __COMMENTS (
    COMMENT_ID VARCHAR(200) PRIMARY KEY,
    POST_ID VARCHAR(200),
    USER_ID VARCHAR(200),
    COMMENT_CONTENT VARCHAR(100),
    COMMENT_TIME DATETIME,
    FOREIGN KEY(USER_ID) REFERENCES __USER(USER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(POST_ID) REFERENCES __POSTS(POST_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE __REPLYCOMMENT(
    POST_ID VARCHAR(200),
    REPLYCOMMENT VARCHAR(200),
    USER_ID VARCHAR(200),
    COMMENTREPLY_ID VARCHAR(200),
    COMMENTREPLY_CONTENT VARCHAR(100),
    COMMENTREPLY_TIME DATETIME,
    PRIMARY KEY(REPLYCOMMENT, COMMENTREPLY_ID),
    FOREIGN KEY(POST_ID) REFERENCES __POSTS(POST_ID) ON DELETE CASCADE ON UPDATE CASCADE FOREIGN KEY(USER_ID) REFERENCES __USER(USER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(REPLYCOMMENT) REFERENCES __COMMENTS(COMMENT_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE __FAVORITES(
    FAVORITES_ID INT AUTO_INCREMENT PRIMARY KEY,
    FAVORITES_BOXSFAVORITE VARCHAR(50)
);

CREATE TABLE __FAVORITES_OF_USER(
    FOU_ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_ID VARCHAR(200),
    FAVORITES_ID INT,
    FOREIGN KEY(USER_ID) REFERENCES __USER(USER_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(FAVORITES_ID) REFERENCES __FAVORITES(FAVORITES_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE __CONVERSATIONS(
    CON_ID VARCHAR(200) PRIMARY KEY,
    CON_TIMECREATE DATETIME DEFAULT NOW(),
);

CREATE TABLE CONVERSATION_USER (
    ID VARCHAR(200) AUTO_INCREMENT PRIMARY KEY,
    CON_ID VARCHAR(200),
    USER_ID VARCHAR(200),
    FOREIGN KEY (CON_ID) REFERENCES __CONVERSATIONS(CON_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (USER_ID) REFERENCES __USER(USER_ID) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE __MESSAGES(
    MESS_ID VARCHAR(200) PRIMARY KEY,
    CON_ID VARCHAR(200) NOT NULL,
    SENDER_ID VARCHAR(200) NOT NULL,
    MESSAGE TEXT NOT NULL,
    CREATED_AT DATETIME DEFAULT NOW(),
    FOREIGN KEY (CON_ID) REFERENCES __CONVERSATIONS(CON_ID) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (SENDER_ID) REFERENCES __USER(ID) ON DELETE CASCADE ON UPDATE CASCADE
);

SHOW TABLES FROM INC_SOCIALMEDIA;