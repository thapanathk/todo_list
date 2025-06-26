const { Pool } = require('pg');

// console.log('Database URL:', process.env.POSTGRES_USER, process.env.PGHOST, process.env.POSTGRES_DB);

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.PGHOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

module.exports = pool;
