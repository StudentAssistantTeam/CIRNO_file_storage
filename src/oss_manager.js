// Environment configuration
var config = require('./config');
// oss
var OSS = require('ali-oss');
// request header
const headers = {
    'x-oss-storage-class': 'Standard',
    'x-oss-object-acl': 'private',
    'Content-Disposition': 'attachment',
    'x-oss-forbid-overwrite': 'true'
};
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
    }),
    // Upload file
    uploadFlieFromLocal: async function(localFile, key, directory) {
        const result = await this.client.put(`${directory}/${key}`, 
            localFile, 
            {headers});
        return result;
    },
    // Create directory
    createDirectory: async function(directory){
        const result = await this.client.put(`${directory}/`,  
            {headers});
        return result;
    }
}