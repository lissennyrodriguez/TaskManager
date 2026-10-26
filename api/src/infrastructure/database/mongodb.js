const mongoose = require('mongoose');
const env = require('../../config/env');

async function connectMongoDB() {
  if (!env.mongoUri) {
    throw new Error('Falta configurar MONGODB_URI en el archivo .env');
  }

  await mongoose.connect(env.mongoUri);

  console.log('MongoDB conectado correctamente');
}

module.exports = {
  connectMongoDB,
};