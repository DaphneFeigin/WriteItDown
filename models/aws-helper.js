var AWS = require('aws-sdk');
var log = require('npmlog');

// To supply credentials from a file, specify it with "npm config set TaskWebsite:awsCreds path_to_file"
// This file should be in the format:
// {
//   "accessKey":"YOUR_ACCESS_KEY_ID",
//   "secretAccessKey":"YOUR_SECRET_KEY",
//   "region":"us-east-1"
// }
// Otherwise, the EC2 role credentials will be used
if (process.env.npm_package_config_awsCreds) {
    log.info("Using credentials at " + process.env.npm_package_config_awsCreds);
    AWS.config.loadFromPath(process.env.npm_package_config_awsCreds);
} else {
    AWS.config.update({region: 'us-east-1'});
}

module.exports = {
    dynamoDB: function() {
        return new AWS.DynamoDB();
    }
}

