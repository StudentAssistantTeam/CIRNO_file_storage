// Environment configuration
var config = require('./config');

// Server APP
var express = require('express');
var app = express();
app.use(express.static('public'));

// OSS Manager
var oss_manager = require('./oss_manager');

// Request Validator
var { body, validationResult } = require('express-validator');

// logging
var morgan = require('morgan');
var logger = require('./logger');
logger.initialize();

// Swagger
var swaggerDocument = require('./swagger');

// Terminal logging
app.use(morgan('combined'));
app.use(morgan('combined', {stream: logger.AccessLogStream}));

// Rewrite console.log to Morgan's stream
const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog.apply(console, args);
  const message = args.map(arg => 
    typeof arg === 'string' ? arg : JSON.stringify(arg)
  ).join(' ');
  logger.AccessLogStream.write(message + '\n');
};

// Swagger UI
app.get('/swagger.json', function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerDocument);
    }
)

// Create Directory
app.post('/createDirectory', 
    body('directory').notEmpty().withMessage('Directory is required'),
    async function(req, res) {
        try{
            // Request body checking
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            result = await oss_manager.createDirectory(req.body.directory);
            return res.status(200).json(result);
        }catch(err){
            // Error handling
            console.error(err);
            return res.status(500).send(`Internal Server Error: ${err}`);
        }
    }
);

// Run app
var server = app.listen(config.server_port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
});