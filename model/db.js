const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',            
  host: 'localhost',            
  database: 'Malika',           
  password: 'joannefrozen18',   
  port: 5432,                   
});

module.exports = pool;  
