var awsHelper = require('./aws-helper.js');
var log = require('npmlog');

var dynamoDB = awsHelper.dynamoDB();

module.exports = {
    authRequest: function(req, callback) {
        //log.info(JSON.stringify(req.headers));
        if (req.body.userId) {
            callback(null);
        } else {
            callback("Who are you?");   
        }
    }
}