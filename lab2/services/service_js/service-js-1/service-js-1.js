const http = require('http')

let data = '';
http.get('http://service-js-2-service/api/service-js-2', (resp) => {

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });
}
)

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Received message from 2nd service: " + data);
}

const server = http.createServer(requestListener);
server.listen(8080);

