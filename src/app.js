// Environment configuration
var config = require('./config');

// fs
var fs = require('fs');

// Server APP
var express = require('express');
var app = express();
app.use(express.static('public'));
app.use(express.json());

// Multer
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

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
                    var content = {
                        success: false,
                        reason: oss_manager.processError(errors.array())
                    };
                    return res.status(400).json(content);
                }
                result = await oss_manager.createDirectory(req.body.directory);
                var content = {
                    success: true,
                    result: result
                };
                return res.status(200).json(content);
            }else{
                var content = {
                    success: false,
                    reason: 'Directory already exists'
                };
                return res.status(409).json(content);
            }
        }catch(err){
            // Error handling
            console.error(err);
            var content = {
                success: false,
                reason: `Internal Server Error: ${err}`
            };
            return res.status(500).json(content);
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
                    var content = {
                        success: false,
                        reason: oss_manager.processError(errors.array())
                    };
                    return res.status(400).json(content);
                }
                result = await oss_manager.deleteDirectory(req.body.directory);
                var content = {
                    success: true,
                    result: result
                };
                return res.status(200).json(content);
            }else{
                var content = {
                    success: false,
                    reason: 'Directory not found'
                };
                return res.status(404).json(content);
            }
        }catch(err){
            // Error handling
            console.error(err);
            var content = {
                success: false,
                reason: `Internal Server Error: ${err}`
            };
            return res.status(500).json(content);
        }
    }
);

/**
 * @swagger
 * /listFiles:
 *    post:
 *      tags:
 *      - List Files
 *      summary: List files in a directory in OSS
 *      description: List files in a directory in OSS
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        description: parameters for checking whether a file exists in OSS
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
// List files in directory
app.post('/listFiles', 
    body('directory').notEmpty().withMessage('Directory is required'), 
    async function(req, res) {
    try{
        // Check if directory exists
        if(await oss_manager.fileExists(`${req.body.directory}/`)){
            console.log(`List files in directory ${req.body.directory}`);
            const files = await oss_manager.listFiles(req.body.directory);
            var content = {
                success: true,
                files: files
            };
            return res.status(200).json(content);
        }else{
            var content = {
                success: false,
                reason: "Directory not exist"
            };
            return res.status(404).json(content);
        }
    }catch(err){
        // Error handling
        console.error(err);
        var content = {
            success: false,
            reason: err
        };
        return res.status(500).json(content);
    }
});

/**
 * @swagger
 * /uploadFile:
 *    post:
 *      tags:
 *      - Upload File
 *      summary: Upload a file to a directory in OSS
 *      description: Upload a file to a directory in OSS
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        description: parameters for checking whether a file exists in OSS
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            directory:
 *              type: string
 *              description: directory name
 *              example: my-directory
 *            file:
 *              type: string
 *              format: binary
 *              description: file to be uploaded
 *      responses:
 *        200:
 *          description: successful operation
 *        400:
 *          description: Invalid input supplied
 *        500:
 *          description: Internal Server Error
 * */
// File Upload
app.post('/uploadFile', 
    upload.single('file'), 
    body('directory').notEmpty().withMessage('Directory is required'),
    body('file').notEmpty().withMessage('File is required'),
    async function(req, res) {
        try{
            // Get file info
            var file = req.file;
            if(await oss_manager.fileExists(`${req.body.directory}/${file.filename}`)){
                // Upload it to OSS
                var result = await oss_manager.uploadFlieFromLocal(req.body.directory, file.path);
                var content = {
                    success: true,
                    result: result
                }
                // Delete local file
                fs.unlinkSync(file.path);
                return res.status(200).json(content);
            }else{
                var content = {
                    success: false,
                    reason: "File already exist"
                }
                // Delete local file
                fs.unlinkSync(file.path);
                return res.status(409).json(content);
            }
        }catch(err){
            // Error handling
            console.error(err);
            var content = {
                success: false,
                reason: err
            }
            return res.status(500).json(content);
        }
    }
);

/**
 * @swagger
 * /deleteFile:
 *    post:
 *      tags:
 *      - Delete File
 *      summary: Delete a file in OSS
 *      description: Delete a file in OSS
 *      produces:
 *      - application/json
 *      parameters:
 *      - in: body
 *        name: body
 *        required: true
 *        schema:
 *          type: object
 *          properties:
 *            directory:
 *              type: string
 *              description: directory name
 *              example: my-directory
 *            filename:
 *              type: string
 *              description: file name to get deleted
 *      responses:
 *        200:
 *          description: successful operation
 *        400:
 *          description: Invalid input supplied
 *        500:
 *          description: Internal Server Error
 * */
// File deletion
app.post('/deleteFile', 
    body('directory').notEmpty().withMessage('Directory is required'),
    body('filename').notEmpty().withMessage('Filename is required'),
    async function(req, res) {
        try{
            if(await oss_manager.fileExists(`${req.body.directory}/${req.body.filename}`)){
                var result = await oss_manager.deleteFile(req.body.directory, req.body.filename);
                var content = {
                    success: true,
                    result: result
                }
                return res.status(200).json(content);
            }else{
                var content = {
                    success: true,
                    reason: "File not exist"
                }
                return res.status(404).json(content);
            }
        }catch(err){
            var content = {
                success: false,
                reason: err
            }
            return res.status(500).json(content);
        }
    }
)

// Run app
var server = app.listen(config.server_port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Server running at http://%s:%s', host, port);
});