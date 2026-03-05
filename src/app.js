// logging
var morgan = require('morgan');
// Environment configuration
var config = require('./config');
// Server APP
var express = require('express');
var app = express();

// Run app
var server = app.listen(config.server_port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
});