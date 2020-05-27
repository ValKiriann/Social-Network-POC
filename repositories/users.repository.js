const dotenv = require('dotenv').config();
const { MYSQL_SCHEMA, MYSQL_USER_TABLE } = process.env;
const baseRepository = require('./base.repository');
let connection = baseRepository.getConnection();
// IMPROVE: ATOMIC base repository functions

exports.getUserDetails = async (userId) => {
    console.info('[STARTING] Get User Details');
    const [rows, fields] = await connection.query(`SELECT id, username, created_at, updated_at, deleted_at, latitude, longitude, language FROM ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}
        WHERE id = ${userId} and deleted_at IS NULL LIMIT 1;`);
    return rows[0];    
}

exports.createNorthernUser = async (username, email, password, latitude, longitude, language) => {
    console.info('[STARTING] Creating  Northern user');
    const [rows, fields] = await connection.query(`INSERT INTO ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}
        (username, email, password, latitude, longitude, language)
        VALUES ("${username}", "${email}", "${password}", "${latitude}", "${longitude}", "${language}");`);
    return rows.insertId;
};