const mysql = require('mysql2');
const dotenv = require('dotenv').config();
const { MYSQL_HOST, MYSQL_USER, MYSQL_USER_PASSWORD } = process.env;
let connection;

exports.getConnection = () => {
    if(!connection) {
        connection = mysql.createConnection({
            connectionLimit: 10,
            host: MYSQL_HOST,
            user: MYSQL_USER,
            password: MYSQL_USER_PASSWORD,
            multipleStatements: true
        });
        connection = connection.promise();
    }
    return connection;
}