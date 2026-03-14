// Environment configuration
var config = require('./config');

// Server APP
var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(express.json())

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

/**
 * @swagger
 * /createDirectory:
 *    post:
 *      tags:
 *      - Create Directory
 *      summary: Create a new directory in OSS
 *      description: Create a new directory in OSS
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        description: parameters for creating a new directory
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            directory:
 *              type: string
 *              description: directory name
 *              example: my-directory
 *      responses:
 *        200:
 *          description: successful operation
 *        400:
 *          description: Invalid input supplied
 *        500:
 *          description: Internal Server Error
 * */
// Create Directory
app.post('/createDirectory', 
    body('directory').notEmpty().withMessage('Directory is required'),
    async function(req, res) {
        try{
            // Check if directory already exists
            if (!await oss_manager.fileExists(`${req.body.directory}/`)){
                // Request body checking
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                result = await oss_manager.createDirectory(req.body.directory);
                return res.status(200).json(result);
            }else{
                return res.status(409).json({ message: 'Directory already exists' });
            }
        }catch(err){
            // Error handling
            console.error(err);
            return res.status(500).send(`Internal Server Error: ${err}`);
        }
    }
);

/**
 * @swagger
 * /deleteDirectory:
 *    post:
 *      tags:
 *      - Delete Directory
 *      summary: Delete a directory in OSS
 *      description: Delete a directory in OSS
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        description: parameters for deleting a existing directory
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            directory:
 *              type: string
 *              description: directory name
 *              example: my-directory
 *      responses:
 *        200:
 *          description: successful operation
 *        400:
 *          description: Invalid input supplied
 *        500:
 *          description: Internal Server Error
 * */
// Delete Directory
app.post('/deleteDirectory', 
    body('directory').notEmpty().withMessage('Directory is required'),
    async function(req, res) {
        try{
            if (await oss_manager.fileExists(`${req.body.directory}/`)){
                // Request body checking
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                result = await oss_manager.deleteDirectory(req.body.directory);
                return res.status(200).json(result);
            }else{
                return res.status(404).json({ message: 'Directory not found' });
            }
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