var fs = require('fs');

// Write Log to file
var AccessLogStream = fs.createWriteStream('logs/app.log', { flags: 'a' });

module.exports = {
    // Initialization
    initialize: function(){
        // Create log directory
        if(!fs.existsSync('logs/app.log')){
            fs.mkdirSync('logs', { recursive: true });
            fs.appendFileSync(
                'logs/app.log', 
                'log file created at '+ new Date() + '\n'
            )
        }
    },
    AccessLogStream:AccessLogStream
}