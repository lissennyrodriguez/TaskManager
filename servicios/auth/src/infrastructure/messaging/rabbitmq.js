const amqp = require('amqplib');

async function connectRabbitMQ() {
  const url = process.env.RABBITMQ_URL;

  if (!url) {
    throw new Error('RABBITMQ_URL no está configurada');
  }

  const connection = await amqp.connect(url);

  console.log('RabbitMQ conectado correctamente');

  return connection;
}

async function publishUserCreated(user) {
  const connection = await connectRabbitMQ();

  try {
    const channel = await connection.createConfirmChannel();

    try {
      const exchange = 'taskmanager.events';
      const routingKey = 'usuario.creado';

      await channel.assertExchange(exchange, 'topic', {
        durable: true,
      });

      const event = {
        event: routingKey,
        data: {
          id: user.Id ?? user.id,
          name: user.Name ?? user.name,
          email: user.Email ?? user.email,
          departmentId: user.DepartmentId ?? user.departmentId,
          role: user.Role ?? user.role,
        },
        createdAt: new Date().toISOString(),
      };

      channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(event)),
        {
          persistent: true,
          contentType: 'application/json',
        }
      );

      await channel.waitForConfirms();

      console.log('Evento usuario.creado publicado correctamente');
    } finally {
      await channel.close();
    }
  } finally {
    await connection.close();
  }
}

module.exports = {
  connectRabbitMQ,
  publishUserCreated,
};