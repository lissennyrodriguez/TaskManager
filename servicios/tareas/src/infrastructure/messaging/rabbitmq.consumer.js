
const amqp = require('amqplib');
const env = require('../../config/env');

async function startUserCreatedConsumer() {
  const connection = await amqp.connect(env.rabbitmqUrl);
  const channel = await connection.createChannel();

  const exchange = 'taskmanager.events';
  const queue = 'taskmanager.tareas.usuario.creado';
  const routingKey = 'usuario.creado';

  await channel.assertExchange(exchange, 'topic', {
    durable: true,
  });

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.bindQueue(queue, exchange, routingKey);

  await channel.prefetch(1);

  console.log('Consumidor RabbitMQ conectado correctamente');

  await channel.consume(queue, (message) => {
    if (!message) return;

    try {
      const event = JSON.parse(message.content.toString());

      console.log('Evento recibido:', event.event);
      console.log('Datos del usuario:', event.data);

      channel.ack(message);
    } catch (error) {
      console.error('Error procesando evento:', error.message);
      channel.nack(message, false, false);
    }
  });
}

module.exports = {
  startUserCreatedConsumer,
};
