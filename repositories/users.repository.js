const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const { MYSQL_HOST, MYSQL_USER, MYSQL_USER_PASSWORD, MYSQL_SCHEMA, MYSQL_USER_TABLE } = process.env;

let connection = mysql.createConnection({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_USER_PASSWORD,
    multipleStatements: true
});

// IMPROVE: ATOMIC base repository functions

connection = connection.promise();

exports.getUserDetails = async (userId) => {
    console.info('[STARTING] Get User Details');
    const [rows, fields] = await connection.query(`SELECT id, username, created_at, updated_at, deleted_at, lat, lon FROM ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}
        WHERE id = ${userId} and deleted_at IS NULL;`);
    return rows[0];    
}

exports.createNorthernUser = async (username, email, password, lat, lon) => {
    console.info('[STARTING] Creating  Northern user');
    const [rows, fields] = await connection.query(`INSERT INTO ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}
        (username, email, password, lat, lon)
        VALUES ("${username}", "${email}", "${password}", "${lat}", "${lon}");`);
    return rows.insertId;
};