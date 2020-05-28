const dotenv = require('dotenv').config();
const { MYSQL_SCHEMA, MYSQL_FRIENDSHIPS_TABLE } = process.env;
const baseRepository = require('./base.repository');
let connection = baseRepository.getConnection();

exports.getFriends = async (userId) => {
    const [rows, fields] = await connection.query(`SELECT requester_user_id, requested_user_id FROM ${MYSQL_SCHEMA}.${MYSQL_FRIENDSHIPS_TABLE} 
    WHERE (requested_user_id = ${userId} 
    OR requester_user_id = ${userId}) 
    AND status = 1`);
    console.info('[FINISHED] Select Friends');
    return rows;
}