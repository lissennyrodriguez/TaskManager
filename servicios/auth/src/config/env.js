
require('dotenv').config();

const env = {
  port: Number(process.env.PORT) || 3001,

  sqlServer: process.env.SQL_SERVER || 'localhost',
  sqlPort: Number(process.env.SQL_PORT) || 1434,
  sqlDatabase: process.env.SQL_DATABASE || 'TaskManagerAuthDB',
  sqlUser: process.env.SQL_USER,
  sqlPassword: process.env.SQL_PASSWORD,
  sqlEncrypt: process.env.SQL_ENCRYPT === 'true',
  sqlTrustCert: process.env.SQL_TRUST_CERT === 'true',

  mongoUri: process.env.MONGODB_URI,

  // Configuración JWT
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '2h',

  // Configuración RabbitMQ
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
};

module.exports = env;
