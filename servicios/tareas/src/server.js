require('dotenv').config();

const app = require('./app');

const {
  startUserCreatedConsumer,
} = require('./infrastructure/messaging/rabbitmq.consumer');

const PORT = Number(process.env.PORT) || 3002;

async function startServer() {
  try {
    await startUserCreatedConsumer();

    app.listen(PORT, () => {
      console.log(
        `Tasks Service ejecutándose en http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.error(
      'Error iniciando Tasks Service:',
      error
    );

    process.exit(1);
  }
}

startServer();