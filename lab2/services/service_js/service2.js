const Hapi = require('hapi');

const server = Hapi.server({
  host: 'localhost',
  port: 8081
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    const response = await new Promise((resolve) => {
        resolve({
          'message': 'Hello from Node server 2'
        });
    });
    return h.response(response);
  },
});

const start = async () => {
  try {
      await server.start();
    console.log('server started');
  } catch (err) {
    console.log('failed to start the server', err);
  }
};

start();