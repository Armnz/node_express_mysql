import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'example',
  database: 'codelex_zoo_database',
};

const pool = mysql.createPool(dbConfig);

export { pool }; 

/* export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'example',
  database: 'codelex_zoo_database', // Change this to the name of your newly created database
}); */
