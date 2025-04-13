require('dotenv').config() // allows to access variables defined in .env file
const mysql = require('mysql2'); // to connect to a MySQL database

// create the connection to the MySQL database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
});
  
// try to connect to the database
connection.connect(err => {
  // if something failed (wrong credentials or non existing database)
  if (err)
    throw err;

  // Otherwise confirm that the connection was successful
  console.log('Connected to MySQL');
});
  
module.exports = connection;