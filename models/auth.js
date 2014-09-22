var awsHelper = require('./aws-helper.js');
var crypto = require('crypto');
var log = require('npmlog');

var dynamoDB = awsHelper.dynamoDB();

var tableName = 'WriteItDownUser';

function computeSHA1(password) {
    var sha = crypto.createHash('sha1');
    sha.update(password);
    return sha.digest('base64');
}

module.exports = {
    authRequest: function(req, callback) {
        if (req.cookies['userId']) {
            callback(null);
        } else {
            callback("Who are you?");   
        }
    },
    
    createNewUser: function(userModel, callback) {
        var putParams = {
            TableName: tableName,
            Item: {
                Id: { S: userModel.userId },
                Password: { S: computeSHA1(userModel.password) },
                SessionId: { S: "0" }
            },
            Expected : {
                Id: {
                    ComparisonOperator: 'NULL'
                }
            }
        };
        dynamoDB.putItem(putParams, function(err, data) {
            if (err) {
                log.error(JSON.stringify(err));
                if (err.code == "ConditionalCheckFailedException") {
                    callback(userModel.userId + " already exists.  Try another name", null);
                } else {
                    callback(err.message, null);
                }
            } else {
                log.info("Created " + userModel.userId);
                signInUser(userModel, callback);
            }
        });
    },
    
    signInUser: function(userModel, callback) {
        var getParams = {
            TableName: tableName,
            Key: {
                Id: { S: userModel.userId },
                SessionId: { S: "0" }
            },
            ConsistentRead: true,
            AttributesToGet: [ 'Password' ]
        };
        dynamoDB.getItem(getParams, function(err, data) {
            if (err) {
                callback(err, null);
            } else {
                if (computeSHA1(userModel.password) == data.Item.Password.S) {
                    callback(null, { userId: userModel.userId });
                } else {
                    callback("Bad username or password", null);
                }
            }
        });
    }
}