const Axios = require('axios');
const Hapi = require('hapi');

const server = Hapi.server({
  host: 'localhost',
  port: 8080,
});

server.route({
  method: 'GET',
  path: '/',
  handler: async (request, h) => {
    try {
      const response = await Axios({
        url: 'http://localhost:8081/',
        method: 'GET',
      });
      return "Hello from Node server 1" + "<br />" + response.data.message;
    } catch (err) {
        console.log(err)
    }
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