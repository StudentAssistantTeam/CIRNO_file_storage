// Dotenv Dependency
require('dotenv').config();

// Environment Variables
const server_port = process.env.PORT || 3000;

// Exporting the variables
module.exports = {
    server_port: server_port
};