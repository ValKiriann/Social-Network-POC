/*
This script allows you to create the Schema and the tables for the POC 
and also the user for the API with limited permissions.
*/

const mysql = require('mysql2');
const dotenv = require('dotenv').config();
let {MYSQL_HOST, MYSQL_ADMIN_USER, MYSQL_ADMIN_PASSWORD, 
    MYSQL_USER, MYSQL_USER_PASSWORD, MYSQL_SCHEMA} = process.env;

let connection = mysql.createConnection({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_ADMIN_USER,
    password: MYSQL_ADMIN_PASSWORD
});

connection = connection.promise();

let createDatabase = async () => {
    const [createSchemaRows] = await connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_SCHEMA} 
        DEFAULT CHARACTER SET = "utf8"`);
    const [createUserRows] = await connection.query(`CREATE USER "${MYSQL_USER}"@"${MYSQL_HOST}" 
        IDENTIFIED BY "${MYSQL_USER_PASSWORD}"`)
}
createDatabase().catch((error) => {
    console.error(`[ERROR]: ${error.code} - ${error.message}`);
    connection.destroy();
})

/*
connection.query(`CREATE USER "${MYSQL_USER}"@"${MYSQL_HOST}" IDENTIFIED BY "${MYSQL_USER_PASSWORD}"`, (error, rows, fields) => {
    if(error) throw error;
    console.info('The user was created');
});
*/
/*
connection.query(`CREATE USER "${MYSQL_USER}"@"${MYSQL_HOST}" IDENTIFIED BY "${MYSQL_USER_PASSWORD}"`)
    .then((error, rows, fields) => {
        if(error) throw error;
        console.info('The user was created');
    })
    .catch((error) => {
        console.log(error);
        connection.destroy();
    })
*/


