var http = require('http');
var nodeStatic = require('node-static');
var file = new nodeStatic.Server('.');

http.createServer(function(req, res) {
    file.serve(req, res);
}).listen(27017);

console.log('Server running on port 27017');