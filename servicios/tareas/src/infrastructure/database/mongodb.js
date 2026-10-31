const mongoose = require('mongoose');
const env = require('../../config/env');

async function connectMongoDB() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI no está configurada');
  }

  await mongoose.connect(env.mongoUri);

  console.log('MongoDB conectado correctamente');
}

module.exports = {
  connectMongoDB,
};