const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const { MYSQL_HOST, MYSQL_USER, MYSQL_USER_PASSWORD, MYSQL_SCHEMA, MYSQL_USER_TABLE } = process.env;
console.log(MYSQL_HOST);
let connection = mysql.createConnection({
    connectionLimit: 10,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_USER_PASSWORD,
    multipleStatements: true
});

connection = connection.promise();

exports.createNorthernUser = async (username, email, password, lat, lon) => {
    //TODO: extract an insert atomic function
    console.info('[STARTING] Creating user');
    const [rows, field] = await connection.query(`INSERT INTO ${MYSQL_SCHEMA}.${MYSQL_USER_TABLE}
        (username, email, password, lat, lon)
        VALUES ("${username}", "${email}", "${password}", "${lat}", "${lon}");`);
    return rows.insertId;
};