
require('dotenv').config();

const sql = require('mssql');

const sqlConfig = {
  server: process.env.SQL_SERVER || 'localhost',
  port: Number(process.env.SQL_PORT) || 1434,
  database: process.env.SQL_DATABASE || 'TaskManagerTasksDB',
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    encrypt: process.env.SQL_ENCRYPT === 'true',
    trustServerCertificate: process.env.SQL_TRUST_CERT === 'true',
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 15000,
  requestTimeout: 15000,
};

let poolPromise;

async function connectSQLServer() {
  if (!poolPromise) {
    const pool = new sql.ConnectionPool(sqlConfig);

    poolPromise = pool.connect().catch((error) => {
      poolPromise = null;
      throw error;
    });
  }

  return poolPromise;
}

async function getSQLPool() {
  return connectSQLServer();
}

module.exports = {
  sql,
  connectSQLServer,
  getSQLPool,
};
