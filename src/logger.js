var fs = require('fs');

module.exports = {
    // Initialization
    initialize: function(){
        // Create log directory
        if(!fs.existsSync('../logs')){
            fs.mkdirSync('logs', { recursive: true });
            fs.appendFileSync('logs/app.log', 'log file created at'+ new Date() + '\n')
        }
    }
}