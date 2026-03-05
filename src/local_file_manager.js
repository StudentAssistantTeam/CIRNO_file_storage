// Dependencies
var fs = require('fs');

// Check if file exists in async
async function checkFileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    checkFileExists: checkFileExists
};