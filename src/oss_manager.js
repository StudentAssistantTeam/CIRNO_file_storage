// Environment configuration
var config = require('./config');
// oss
var OSS = require('ali-oss');
// OSS object
module.exports = {
    // Creating client
    client : new OSS({
        region: config.oss_region_id,
        accessKeyId: config.oss_key_id,
        accessKeySecret: config.oss_key_secret,
        authorizationV4: true,
        bucket: config.oss_bucket_name,
        endpoint: config.oss_endpoint
    })
}