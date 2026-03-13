// Get Swagger
const swaggerJSDoc = require('swagger-jsdoc')

// Swagger Definitions
const swaggerDefinition = {
  info: {
    title: 'CIRNO File Storage API',
    version: '0.1.0',
    description: 'Demonstrating how to describe a RESTful API with Swagger'
  },
  host: 'localhost:8010',
  basePath: '/'
}

var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./app.js'] // 扫描routes文件夹下面的所有js文件
}

const swaggerSpec = swaggerJSDoc(options)

module.exports = swaggerSpec