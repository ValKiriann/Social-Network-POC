const dotenv = require('dotenv').config();
const { MYSQL_SCHEMA, MYSQL_USER_TABLE } = process.env;
const baseRepository = require('./base.repository');
let connection = baseRepository.getConnection();

exports.getUsers = async (filters, deleted, limit) => {
    let query = `SELECT id, username, created_at, updated_at, deleted_at, latitude, longitude, language FROM ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}`
    if(!query.deleted) {
        filters.push(['deleted_at', null])
    }
    for(let i = 0; i < filters.length; i++) {
        query += i == 0 ? ' WHERE ' : ' AND '
        query += filters[i][0] == 'deleted_at' ? `deleted_at IS NULL` : `${filters[i][0]} = "${filters[i][1]}"`
    }
    if(limit) {
        query += ` LIMIT ${limit}`
    }
    const [rows, fields] = await connection.query(query);
    console.info('[FINISHED] Get Users');
    return rows;
}

exports.createNorthernUser = async (username, email, password, latitude, longitude, language) => {
    console.info('[STARTING] Creating  Northern user');
    const [rows, fields] = await connection.query(`INSERT INTO ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}
        (username, email, password, latitude, longitude, language)
        VALUES ("${username}", "${email}", "${password}", "${latitude}", "${longitude}", "${language}");`);
    return rows.insertId;
};

exports.updateUserDetails = async (userId, updateValues) => {
    let query = `UPDATE ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}`
    for(let i = 0; i < updateValues.length; i++) {
        query += i == 0 ? ' SET ' : ', '
        query += `${updateValues[i][0]} = "${updateValues[i][1]}"`
    }
    query += ` WHERE id = ${userId} AND deleted_at IS NULL`
    console.log(query);
    const [rows, fields] = await connection.query(query);
    console.info('[FINISHED] Update user');
    return rows.info;
}