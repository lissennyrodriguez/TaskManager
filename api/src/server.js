const app = require('./app');
const env = require('./config/env');

const { connectSQLServer } = require('./infrastructure/database/sqlserver');
const { connectMongoDB } = require('./infrastructure/database/mongodb');

async function startServer() {
  try {
    if (!env.jwtSecret || env.jwtSecret.length < 32) {
      throw new Error('Configura JWT_SECRET con al menos 32 caracteres en .env');
    }

    await connectSQLServer();
    await connectMongoDB();

    app.listen(env.port, () => {
      console.log(`TaskManager API ejecutándose en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar TaskManager:', error.message);
    process.exit(1);
  }
}

startServer();