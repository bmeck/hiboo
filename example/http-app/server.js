var http = require('http');

console.error('ARGV', process.argv);
console.error('CWD', process.cwd());
console.error('ENV', process.env);

var server = http.createServer(function (req, res) {
   res.end('I am a meat popsicle.');
});
server.on('listening', function () {
   process.send({
      event: 'listening',
      address: server.address()
   });
});

server.listen(process.env.PORT || 80, '::0');