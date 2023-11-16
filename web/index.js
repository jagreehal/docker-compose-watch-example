var http = require('http');
var port = process.env.PORT || 8000;
const date = new Date();
http
  .createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`Hello World!! - ${date}\n`);
  })
  .listen(port);
