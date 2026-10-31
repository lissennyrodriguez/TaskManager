const sql = require('mssql');
const env = require('../../config/env');

const sqlConfig = {
  server: env.sqlServer,
  port: env.sqlPort,
  database: env.sqlDatabase,
  user: env.sqlUser,
  password: env.sqlPassword,

  options: {
    encrypt: env.sqlEncrypt,
    trustServerCertificate: env.sqlTrustCert,
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