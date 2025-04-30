const mysql = require('mysql2/promise');
const db = mysql.createPool({
 host: 'localhost',
 user: 'root',
 password: 'laboratorio',
 database: 'sistema_petshop'
});
module.exports = db;