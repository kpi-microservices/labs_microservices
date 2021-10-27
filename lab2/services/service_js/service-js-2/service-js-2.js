const http = require('http');

var broken = false

const requestListener = function (req, res) {
    if (req.url === '/api/service-js-2') {
        res.writeHead(200);
        if (broken) {
            setTimeout(() => {
                res.end('Hello world! You have experienced a 5 sec lag ...')
            }, 5000)
        } else {
            res.end("Hello world!")
        }
        return
    } else if (req.url === '/api/service-js-2/break') {
        broken = true
        res.writeHead(200);
        res.end("You have successfully broken your service!")
        return
    }

    res.writeHead(404);
    res.end(`Invalid url: '${req.url}'`)
}


const server = http.createServer(requestListener);
server.listen(8080);
