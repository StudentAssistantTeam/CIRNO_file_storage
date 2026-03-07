// Environment configuration
var config = require('./config');
// Server APP
var express = require('express');
var app = express();
// logging
var morgan = require('morgan');
var logger = require('./logger');
logger.initialize();
// Terminal logging
app.use(morgan('combined'));
app.use(morgan('combined', {stream: logger.AccessLogStream}));
// Middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    return res.status(500).send("Internal Server Error");
});
// Run app
var server = app.listen(config.server_port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
});