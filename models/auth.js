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

function signInUser(userModel, callback) {
    var getParams = {
        TableName: tableName,
        Key: {
            Id: { S: userModel.userId },
            SessionId: { S: "0" }
        },
        ConsistentRead: true,
        AttributesToGet: [ 'Id', 'Salt', 'Password' ]
    };
    dynamoDB.getItem(getParams, function(err, data) {
        if (err) {
            log.error("signin: " + err);
            callback("Error signing in; please try again", null);
        } else {
            var saltedPassword = data.Item.Salt.S + userModel.password;
            if (data.Item && computeSHA1(saltedPassword) == data.Item.Password.S) {
                callback(null, { userId: data.Item.Id.S });
            } else {
                callback("Bad username or password", null);
            }
        }
    });
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
        var salt = crypto.randomBytes(16).toString('hex');
        var saltedPassword = salt + userModel.password;
        var putParams = {
            TableName: tableName,
            Item: {
                Id: { S: userModel.userId },
                Salt: { S: salt },
                Password: { S: computeSHA1(saltedPassword) },
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
    
    signInUser: signInUser
}