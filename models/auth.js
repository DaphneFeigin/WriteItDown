var awsHelper = require('./aws-helper.js');
var log = require('npmlog');

var dynamoDB = awsHelper.dynamoDB();

module.exports = {
    authRequest: function(req, callback) {
        if (req.cookies['userId']) {
            callback(null);
        } else {
            callback("Who are you?");   
        }
    }
}