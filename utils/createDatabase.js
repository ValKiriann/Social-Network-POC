/*
This script allows you to create the Schema and the tables for the POC 
and also the user for the API with limited permissions.
*/

const mysql = require('mysql2');
const dotenv = require('dotenv').config();
let {MYSQL_HOST, MYSQL_ADMIN_USER, MYSQL_ADMIN_PASSWORD, 
    MYSQL_USER, MYSQL_USER_PASSWORD, MYSQL_SCHEMA, MYSQL_USER_TABLE} = process.env;

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
        GRANT SHOW DATABASES ON *.* TO "${MYSQL_USER}"@"${MYSQL_HOST}";
        GRANT CREATE, SELECT, DELETE, UPDATE ON ${MYSQL_SCHEMA}.* TO "${MYSQL_USER}"@"${MYSQL_HOST}";
        FLUSH PRIVILEGES;`);

    console.info('[FINISHED] API user was created');
    console.info(`[STARTING] Creating ${MYSQL_USER_TABLE} table`);

    const createUSerTable = await connection.query(`CREATE TABLE IF NOT EXISTS ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE} ( 
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        lat INT NOT NULL,
        lon INT NOT NULL
    )ENGINE=INNODB;`);

    console.info(`[FINISHED] Table ${MYSQL_USER_TABLE} was created`);
    
    connection.destroy();
}

createDatabase().catch((error) => {
    console.error(`[ERROR]: ${error.code} - ${error.message}`);
    connection.destroy();
})


