// Get Swagger
const swaggerJSDoc = require('swagger-jsdoc')

// Get path
const path = require('path');

// Swagger Definitions
const swaggerDefinition = {
  info: {
    title: 'CIRNO File Storage API',
    version: '0.1.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger'
  },
  servers: [
    {
      url: 'http://localhost:8010',
      description: 'Development server'
    }   
  ]
}

var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: [path.join(__dirname, 'app.js')]
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec