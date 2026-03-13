// Dotenv Dependency
require('dotenv').config();

// Environment Variables
const server_port = process.env.PORT || 3000;
const oss_key_id = process.env.OSS_KEY_ID;
const oss_key_secret = process.env.OSS_KEY_SECRET;
const oss_bucket_name = process.env.OSS_BUCKET_NAME;
const oss_region_id = process.env.OSS_REGION_ID;
const oss_endpoint = process.env.OSS_ENDPOINT;

// Exporting the variables
module.exports = {
    server_port: server_port,
    oss_key_id: oss_key_id,
    oss_key_secret: oss_key_secret,
    oss_endpoint: oss_endpoint,
    oss_region_id: oss_region_id,
    oss_endpoint: oss_endpoint,
    oss_bucket_name: oss_bucket_name
};