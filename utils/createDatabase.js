/*
This script allows you to create the Schema and the tables for the POC 
and also the user for the API with limited permissions.
*/
const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const {MYSQL_HOST, MYSQL_ADMIN_USER, MYSQL_ADMIN_PASSWORD, MYSQL_USER,
    MYSQL_USER_PASSWORD, MYSQL_SCHEMA, MYSQL_USERS_TABLE, MYSQL_FRIENDSHIPS_TABLE} = process.env;
// Change this value if you want to insert dummy data - Boolean
const populate = 1;

let connection = mysql.createConnection({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_ADMIN_USER,
    password: MYSQL_ADMIN_PASSWORD,
    multipleStatements: true
});

connection = connection.promise();

let createDatabase = async () => {
    console.info('[STARTING] Creating Schema');

    const createSchema = await connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_SCHEMA} 
        DEFAULT CHARACTER SET = "utf8"`);

    console.info("[FINISHED] Database was created");
    console.info('[STARTING] Creating mysql user');

    const createUser = await connection.query(`CREATE USER IF NOT EXISTS "${MYSQL_USER}"@"${MYSQL_HOST}" 
        IDENTIFIED BY "${MYSQL_USER_PASSWORD}";
        GRANT SHOW DATABASES ON *.* TO "${MYSQL_USER}"@"%" IDENTIFIED BY "${MYSQL_USER_PASSWORD}";
        GRANT INSERT, SELECT, DELETE, UPDATE ON ${MYSQL_SCHEMA}.* TO "${MYSQL_USER}"@"%";
        FLUSH PRIVILEGES;`);

    console.info('[FINISHED] API user was created');
    console.info(`[STARTING] Creating ${MYSQL_USERS_TABLE} table`);

    const createUserTable = await connection.query(`CREATE TABLE IF NOT EXISTS ${MYSQL_SCHEMA}.${MYSQL_USERS_TABLE} ( 
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        latitude INT NOT NULL,
        longitude INT NOT NULL,
        language CHAR(3) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL
    )ENGINE=INNODB;`);

    console.info(`[FINISHED] Table ${MYSQL_USERS_TABLE} was created`);
    console.info(`[STARTING] Table ${MYSQL_FRIENDSHIPS_TABLE} was created`);

    const createFriendshipTable = await connection.query(`CREATE TABLE IF NOT EXISTS ${MYSQL_SCHEMA}.${MYSQL_FRIENDSHIPS_TABLE} ( 
        id INT AUTO_INCREMENT PRIMARY KEY,
        requester_user_id INT NOT NULL,
        requested_user_id INT NOT NULL,
        status BOOLEAN NOT NULL,
        FOREIGN KEY (requester_user_id)
        REFERENCES users(id),
        FOREIGN KEY (requested_user_id)
        REFERENCES users(id)
    )ENGINE=INNODB;`);

    console.info(`[FINISHED] Table ${MYSQL_FRIENDSHIPS_TABLE} was created`);

    if(populate) {
        console.info(`[STARTING] Creating dummy data for ${MYSQL_USERS_TABLE}`);
        const createUsersData = await connection.query(`INSERT INTO ${MYSQL_SCHEMA}.${MYSQL_USERS_TABLE} VALUES 
        ('1','amber80','gmedhurst@example.net','73948f11ec21f905d58b0d1c8bf66e774bc33eb2','61','38','IN','1997-08-19 01:01:04','2013-05-05 07:06:55', NULL),
        ('2','spaucek','schroeder.laura@example.org','aad59d48476ef9b4d233749208af809c3236dfc0','47','31','DE','1991-01-08 21:11:40','1980-12-23 01:50:57', NULL),
        ('3','may.considine','predovic.pamela@example.net','8c31511d9be73d7d73307fdd88e54cabd5af2fa9','65','23','IN','2005-09-02 19:37:14','1991-04-02 07:19:02', NULL),
        ('4','jbernier','gheaney@example.org','928db07cf6c04b81ebb8315fbbc6b560905f18d0','34','29','FR','1977-06-04 17:52:20','1971-06-22 05:19:12', NULL),
        ('5','okeefe.gaston','tromp.elena@example.com','8855275534a62b9d4de55754134a2570a913ab2a','66','12','GB','1987-02-07 08:58:10','1994-03-21 02:16:33', NULL),
        ('6','hosea.effertz','willie.batz@example.org','a01fd15fc900614963bc6ceb7718f7f4a1058b3e','44','47','MX','2003-10-25 21:52:57','1989-06-29 17:02:30', NULL),
        ('7','al.hyatt','marlee.daugherty@example.com','d83a5ed8493ae679006d68f784a03e269ae64a64','25','86','CA','2010-05-13 15:09:48','2018-06-04 23:25:49', NULL),
        ('8','joaquin.lubowitz','psimonis@example.net','cbb5ec41991ffb0c9c222e01ae66fb48973f92ec','74','27','RU','1983-03-23 22:24:03','1973-08-20 12:49:22', NULL),
        ('9','conn.jennie','kunde.lenny@example.org','c1f9326ef927fa2beef32763e4a15e7d9bf1b916','42','44','CA','2018-09-09 11:11:11','1977-10-03 12:42:38', NULL),
        ('10','kemmer.hiram','aanderson@example.net','5507387555d0b21b6f51dd0f339110f4490eec94','49','23','PT','1970-12-07 17:44:51','2017-03-17 09:09:44', NULL),
        ('11','fred.medhurst','annabell10@example.com','44acf5e9040b5fdcd14be77036dd4bd8181cdb92','84','5','IT','2020-02-12 12:25:17','1970-11-16 13:03:18', NULL),
        ('12','ardella.lynch','everett55@example.org','c23a02fdafcafa0ca6582a3e0a5d106062b3d206','27','29','IE','1980-07-06 01:02:28','1982-04-17 10:18:25', NULL),
        ('13','wunsch.alfred','nferry@example.com','1559ca27fb4a25c80762f2b0f4d8b0967cf904d0','11','81','PT','1990-06-08 02:38:19','2008-03-18 07:27:48', NULL),
        ('14','prowe','evie59@example.org','bccd2489912d4bffb67dc038f0f506610882cc58','31','55','RU','2016-01-09 05:32:51','2020-04-30 14:33:28', NULL),
        ('15','sauer.kane','cfranecki@example.com','aee274d4bc3889308e6d643a12932ef9ad5b410e','70','6','US','2016-03-19 14:39:42','1971-10-03 21:15:23', NULL),
        ('16','sblick','jlebsack@example.org','7d3a085c6a0577977391a2fef70d062821f05c9f','8','6','IE','1973-11-12 19:52:31','2018-05-31 12:46:59', NULL),
        ('17','schultz.lesly','irving.spencer@example.com','5e598f07e21ad12e02f58ab7294f7c66208eb063','26','20','CA','2018-06-16 03:33:44','1999-02-27 03:07:18', NULL),
        ('18','soconnell','imuller@example.com','d8c77290d3497fcfc53767e947429dd2100fd936','74','86','IN','2019-02-20 12:43:34','2000-04-22 12:25:19', NULL),
        ('19','monty.nader','nherman@example.org','597e2e6bb2edb172209ee1118d61673af59ffe9f','34','33','DE','1977-01-02 22:41:15','1993-11-08 05:53:42', NULL),
        ('20','makayla34','beahan.antonette@example.net','fd1d964284d64418a8d918e31c46399e50105f3e','9','61','IT','2001-12-03 18:00:41','1989-11-24 23:49:30', NULL); 
        `);
        console.info(`[FINISHED] Dummy data for ${MYSQL_USERS_TABLE} was created.`);
        console.info(`[STARTING] Creating dummy data for ${MYSQL_FRIENDSHIPS_TABLE}`);
        const createFriendshipsData = await connection.query(`INSERT INTO ${MYSQL_SCHEMA}.${MYSQL_FRIENDSHIPS_TABLE} VALUES 
        ('1','19','13','1'),
        ('2','6','3','0'),
        ('3','19','6','1'),
        ('4','8','20','1'),
        ('5','17','4','1'),
        ('6','17','15','0'),
        ('7','11','1','1'),
        ('8','4','9','1'),
        ('9','4','5','0'),
        ('10','4','7','1'),
        ('11','18','2','1'),
        ('12','16','1','1'),
        ('13','1','5','1'),
        ('14','8','19','1'),
        ('15','13','18','1'),
        ('16','10','1','0'),
        ('17','7','19','0'),
        ('18','16','11','1'),
        ('19','19','2','1'),
        ('20','13','10','1'); 
        `);
        console.info(`[FINISHED] Dummy data for ${MYSQL_FRIENDSHIPS_TABLE} was created.`);
    }

    connection.destroy();
}

createDatabase().catch((error) => {
    console.error(`[ERROR]: ${error.code} - ${error.message}`);
    connection.destroy();
})


